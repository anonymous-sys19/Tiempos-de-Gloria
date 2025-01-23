/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {  useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Newspaper, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Layout } from './Loyout/Loyout';
import { Post } from './Posts/Post';
import BlogPage from './DayliVerse/PostDayliVerse';
import UseUploading from './UploadingFiles/UseUploading';
import { useFetchPosts } from '@/hooks/PostHooks/useFetchPosts';


export default function Dashboard() {
  const {posts} = useFetchPosts();
  const [activeMenu, setActiveMenu] = useState<'publicaciones' | 'dayliverse'>('publicaciones');
  const navigate = useNavigate();


  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const MenuButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out',
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight className={cn('ml-auto transition-transform', active && 'transform rotate-90')} />
    </button>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'publicaciones':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {posts.map((post) => (
              <Post key={post.id} post={{ ...post, likes: post.likes || 0 }} onUserClick={handleUserClick} />
            ))}
          </div>
        );
      case 'dayliverse':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <BlogPage />
          </div>
        );
      default:
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">Selecciona una opción del menú para ver el contenido</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <UseUploading />

        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col">
            <div className="flex space-x-2 mb-4">
              <MenuButton
                active={activeMenu === 'publicaciones'}
                onClick={() => setActiveMenu('publicaciones')}
                icon={<FileText className="w-5 h-5" />}
                label="Publicaciones"
              />
              <MenuButton
                active={activeMenu === 'dayliverse'}
                onClick={() => setActiveMenu('dayliverse')}
                icon={<Newspaper className="w-5 h-5" />}
                label="Post DayliVerse"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu || 'empty'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
