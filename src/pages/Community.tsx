import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Plus, MoreHorizontal, Heart, MessageCircle, Share2, Shield, Moon, X, Send, Image as ImageIcon, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Post {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
        name: string;
        avatar_url?: string;
    };
    likes_count: number;
    user_has_liked: boolean;
    comments_count: number;
}

interface Comment {
    id: string;
    post_id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        name: string;
        avatar_url?: string;
    };
}

interface Notification {
    id: string;
    type: 'like' | 'reply' | 'mention' | 'system';
    actor_id: string;
    post_id: string;
    read: boolean;
    created_at: string;
    actor_profiles?: {
        name: string;
        avatar_url?: string;
    };
}

export default function Community() {
    const { user } = useAuth();
    const { hasUnreadNotifications, setHasUnreadNotifications } = useAppContext();
    const [posts, setPosts] = useState<Post[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Comments State
    const [showComments, setShowComments] = useState(false);
    const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    
    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const cameraInputRef = React.useRef<HTMLInputElement>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
                    *,
                    profiles:user_id(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch likes for these posts
            const { data: likesData } = await supabase
                .from('community_likes')
                .select('*');

            // Fetch comments count
            const { data: commentsData } = await supabase
                .from('community_comments')
                .select('post_id');

            const processedPosts = data.map((post: any) => ({
                ...post,
                likes_count: likesData?.filter(l => l.post_id === post.id).length || 0,
                user_has_liked: likesData?.some(l => l.post_id === post.id && l.user_id === user?.id) || false,
                comments_count: commentsData?.filter(c => c.post_id === post.id).length || 0
            }));

            setPosts(processedPosts);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    *,
                    actor_profiles:actor_id(name, avatar_url)
                `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setNotifications(data || []);
            const unread = data?.some(n => !n.read) || false;
            setHasUnreadNotifications(unread);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchNotifications();
    }, [user]);

    const markNotificationsAsRead = async () => {
        if (!user || notifications.length === 0) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            setHasUnreadNotifications(false);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida.');
            return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('Canvas to Blob failed'));
                        },
                        'image/jpeg',
                        0.8
                    );
                };
            };
            reader.onerror = reject;
        });
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!user) return null;
        try {
            const compressedBlob = await compressImage(file);
            const fileExt = 'jpg';
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('community-posts')
                .upload(filePath, compressedBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('community-posts').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPostContent.trim()) return;

        setIsSubmitting(true);
        try {
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
            }

            const { error } = await supabase.from('community_posts').insert({
                user_id: user.id,
                content: newPostContent,
                image_url: imageUrl
            });

            if (error) throw error;

            setNewPostContent('');
            setSelectedImage(null);
            setImagePreview(null);
            setShowCreateModal(false);
            fetchPosts();
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Error al crear la publicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchComments = async (postId: string) => {
        try {
            setLoadingComments(true);
            const { data, error } = await supabase
                .from('community_comments')
                .select(`
                    *,
                    profiles:user_id(name, avatar_url)
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments(data || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim() || !selectedPostForComments) return;

        try {
            const { data, error } = await supabase
                .from('community_comments')
                .insert({
                    post_id: selectedPostForComments.id,
                    user_id: user.id,
                    content: newComment.trim()
                })
                .select(`
                    *,
                    profiles:user_id(name, avatar_url)
                `)
                .single();

            if (error) throw error;

            setComments(prev => [...prev, data]);
            setNewComment('');
            
            // Notify post author
            if (selectedPostForComments.user_id !== user.id) {
                await supabase.from('notifications').insert({
                    user_id: selectedPostForComments.user_id,
                    actor_id: user.id,
                    type: 'reply',
                    post_id: selectedPostForComments.id,
                    content: newComment.substring(0, 50)
                });
            }

            // Update local count
            setPosts(prev => prev.map(p => 
                p.id === selectedPostForComments.id 
                    ? { ...p, comments_count: p.comments_count + 1 } 
                    : p
            ));
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleLike = async (postId: string, hasLiked: boolean) => {
        if (!user) return;

        try {
            if (hasLiked) {
                await supabase.from('community_likes').delete().match({ user_id: user.id, post_id: postId });
            } else {
                const { error } = await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId });
                
                if (!error) {
                    // Get the author of the post to notify them
                    const post = posts.find(p => p.id === postId);
                    if (post && post.user_id !== user.id) {
                        await supabase.from('notifications').insert({
                            user_id: post.user_id,
                            actor_id: user.id,
                            type: 'like',
                            post_id: postId
                        });
                    }
                }
            }
            fetchPosts(); // Refresh to update counts
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24">
            <header className="sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-purple-500/10 dark:border-purple-500/20">
                <div className="flex items-center justify-between p-4">
                    <button className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-full p-2 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Normalización y Comunidad</h1>
                    <button 
                        onClick={() => {
                            setShowNotifications(true);
                            markNotificationsAsRead();
                        }}
                        className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-full p-2 transition-colors relative"
                    >
                        <Bell className="w-6 h-6" />
                        {hasUnreadNotifications && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
                        )}
                    </button>
                </div>
            </header>

            {/* Stories/Topics Section (Hardcoded for now as placeholders) */}
            <div className="pt-4 pb-2 px-4 overflow-x-auto no-scrollbar">
                <div className="flex space-x-4 min-w-max">
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="relative w-[68px] h-[68px] rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                            <Plus className="text-purple-600 dark:text-purple-400 w-8 h-8" />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Compartir</span>
                    </button>
                    
                    {[
                        { name: 'Éxito', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
                        { name: 'Consejos', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop' },
                        { name: 'Humor', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
                        { name: 'Viajes', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
                    ].map((story, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-[68px] h-[68px] rounded-full p-[2px] bg-gradient-to-tr from-purple-600 to-purple-400 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full border-2 border-slate-50 dark:border-slate-900 overflow-hidden bg-slate-200">
                                    <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{story.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 px-4 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500">Aún no hay publicaciones. ¡Sé el primero en compartir!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div 
                            key={post.id} 
                            id={`post-${post.id}`}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-20"
                        >
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                                        {post.profiles?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.profiles?.name || 'Usuario'}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {post.image_url && (
                                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative">
                                    <img src={post.image_url} alt="Post content" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="p-4">
                                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-4">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleLike(post.id, post.user_has_liked)}
                                        className={cn(
                                            "flex items-center gap-1 transition-colors",
                                            post.user_has_liked ? "text-red-500" : "text-slate-600 dark:text-slate-400 hover:text-red-500"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", post.user_has_liked && "fill-current")} />
                                        <span className="text-sm font-medium">{post.likes_count}</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedPostForComments(post);
                                            setShowComments(true);
                                            fetchComments(post.id);
                                        }}
                                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{post.comments_count}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ml-auto">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Promotional Card */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-purple-900/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Tu historia importa</h3>
                        <p className="text-white/90 text-sm mb-4">Ayuda a otros a normalizar su terapia compartiendo tu progreso.</p>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-purple-600 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Compartir mi Proceso
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg">Nueva Publicación</h3>
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePost} className="p-4 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold shrink-0">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="¿Cómo va tu terapia hoy? Comparte un éxito o pide consejo..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 resize-none min-h-[120px] text-lg"
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                {imagePreview && (
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-900">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-900/60 text-white rounded-full hover:bg-slate-900/80 transition-all backdrop-blur-sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
                                        >
                                            <ImageIcon className="w-6 h-6" />
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="p-2.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
                                        >
                                            <Camera className="w-6 h-6" />
                                        </button>
                                        
                                        {/* Hidden Inputs */}
                                        <input 
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileSelected}
                                        />
                                        <input 
                                            ref={cameraInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            onChange={handleFileSelected}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || (!newPostContent.trim() && !selectedImage)}
                                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-purple-500/20"
                                    >
                                        {isSubmitting ? 'Publicando...' : (
                                            <>
                                                Publicar
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Notifications Tray */}
            {showNotifications && (
                <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-purple-600" />
                                Notificaciones
                            </h3>
                            <button 
                                onClick={() => setShowNotifications(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100vh-64px)] pb-20">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                        <Bell className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">No tienes notificaciones todavía.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => {
                                                setShowNotifications(false);
                                                if (n.post_id) {
                                                    const el = document.getElementById(`post-${n.post_id}`);
                                                    el?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={cn(
                                                "p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer",
                                                !n.read && "bg-blue-50/30 dark:bg-blue-900/10"
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-lg font-bold text-purple-600 shrink-0">
                                                {n.actor_profiles?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-bold">{n.actor_profiles?.name}</span>
                                                    {n.type === 'like' && " le ha dado me gusta a tu publicación."}
                                                    {n.type === 'reply' && " ha respondido a tu publicación."}
                                                    {n.type === 'mention' && " te ha mencionado."}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                                                </p>
                                            </div>
                                            {!n.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Tray */}
            {showComments && selectedPostForComments && (
                <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowComments(false)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-purple-600" />
                                Comentarios
                            </h3>
                            <button 
                                onClick={() => setShowComments(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingComments ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-slate-500">Aún no hay comentarios. ¡Inicia la conversación!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold shrink-0 text-xs">
                                            {comment.profiles?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                                                <h5 className="text-xs font-bold mb-1">{comment.profiles?.name}</h5>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-500 ml-1">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 pb-8">
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escribe un comentario..."
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <button 
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-500 disabled:opacity-50 transition-colors shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
