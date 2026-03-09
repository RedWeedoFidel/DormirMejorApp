import { ArrowLeft, Bell, Plus, MoreHorizontal, Heart, MessageCircle, Share2, Shield, Moon } from 'lucide-react';

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-24">
      <header className="sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-purple-500/10 dark:border-purple-500/20">
        <div className="flex items-center justify-between p-4">
          <button className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-full p-2 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Normalización y Comunidad</h1>
          <button className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-full p-2 transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>
        </div>
      </header>

      <div className="pt-4 pb-2 px-4 overflow-x-auto no-scrollbar">
        <div className="flex space-x-4 min-w-max">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-[68px] h-[68px] rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center bg-purple-500/5">
              <Plus className="text-purple-600 dark:text-purple-400 w-8 h-8" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Compartir</span>
          </div>
          
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

      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mentores Destacados</h3>
          <a href="#" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700">Ver todos</a>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex -space-x-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Mentor 1" className="w-10 h-10 border-2 border-white dark:border-slate-800 rounded-full object-cover" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Mentor 2" className="w-10 h-10 border-2 border-white dark:border-slate-800 rounded-full object-cover" />
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Mentor 3" className="w-10 h-10 border-2 border-white dark:border-slate-800 rounded-full object-cover" />
            <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-purple-600 border-2 border-white dark:border-slate-800 rounded-full hover:bg-purple-700">+8</div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Peer Support</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Conecta con veteranos</p>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Carlos M." className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Carlos M.</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hace 2 horas • Mascarilla Facial</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative">
            <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop" alt="Sleeping peacefully" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 shadow-sm flex items-center gap-1">
              <Moon className="w-3 h-3" />
              Noche 45
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">124</span>
              </button>
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">18</span>
              </button>
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              <span className="font-bold">¡Por fin sin sueño!</span> Al principio me costó adaptarme a la presión, pero hoy desperté sintiéndome como nuevo. Si estás empezando, no te rindas, vale la pena. 💪✨ #CPAPJourney #DormirMejor
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Tu historia importa</h3>
            <p className="text-white/90 text-sm mb-4">Ayuda a otros a normalizar su terapia compartiendo tu progreso.</p>
            <button className="bg-white text-purple-600 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Compartir mi Proceso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
