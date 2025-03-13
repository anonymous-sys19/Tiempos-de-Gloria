
import { ModeToggle } from '../ThemeComponents/mode-toggle'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Home,
  Users,
  ChevronDown,
  Grid,
  PlayCircle,
  Menu,
  Bookmark,
  Flag,
  Calendar,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  Book,
  BookA,
  BookPlusIcon,
  Star,
  BookOpenText
} from 'lucide-react'
import { useAuth, UserData } from "@/hooks/userAuth"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatBubbleIcon, StarFilledIcon } from '@radix-ui/react-icons'
import { SearchInput } from './Search'
import { LazyImage } from '../Personalizados/ImagePost'

interface LayoutProps {
  children: React.ReactNode;
}

const getInitials = (name: string): string => {
  return name
  .split(' ')
  .map((word: string) => word[0])
  .join('')
    .toUpperCase()
}





export const  Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user,  session, signOut, getUser } = useAuth()
  
    const [userData, setUserData] = useState<UserData | null>(null)
  
    useEffect(() => {
      if (session?.user.id) {
        const fetchUserData = async () => {
          const data = await getUser()  // Llamamos a la función para obtener los datos del perfil
          setUserData(data)  // Guardamos los datos del usuario en el estado
        }
  
        fetchUserData()
      }
    }, [session?.user?.id])


 
  const navigate = useNavigate()

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()  // Evita la recarga
    const href = e.currentTarget.getAttribute("href"); // Obtiene la ruta del atributo href
    if (href) navigate(href) // Navega a la ruta sin recargar

  }



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    //Limpia el evento cuando el componente se desmonte

    return () => window.removeEventListener("scroll", handleScroll);
  })



  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className={`${isScrolled ? 'fixed top-0 w-full' : 'relative'
        } bg-white dark:bg-gray-800 shadow-sm z-10 transition-transform duration-300 ease-in-out`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <img src='/Zona.gif' className="h-auto w-32" />
              {/* <video controls src='/public/1107.mp4' /> */}
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <SearchInput />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src={userData?.avatar_url || undefined} alt={userData?.display_name} className='object-cover' /> */}
                <LazyImage urlItem={userData?.avatar_url ?? ''} className='object-cover' placeholder='Image' />
                
                <AvatarFallback>{userData?.display_name? getInitials(userData.display_name) : 'U'}</AvatarFallback>
              </Avatar>

              {/* El nombre solo será visible en pantallas grandes */}
              <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm font-medium hidden lg:block">
                <span className="sr-only">Abrir menú de usuario para </span>
                {session ? userData?.display_name : "Loading...Usuario"}
              </span>


            </div>
            {/*  */}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:translate-x-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md overflow-y-auto transition-transform duration-300 ease-in-out h-full`}>
          <nav className="mt-5 px-2 space-y-1">
            <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Home className="mr-4 h-6 w-6" />
              <a href="/" className='flex w-full items-center justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' onClick={handleNavigation}>
                Inicio
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Users className="mr-4 h-6 w-6" />
                  Ministerios
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Ministerio del adulto mayor</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Ministerio de Caballeros</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Ministerio de Damas</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/ministerio-emergente' className="dropdown-item-text" onClick={handleNavigation}>G Emergente</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='ministerio-junior' className="dropdown-item-text" onClick={handleNavigation}>GE Junior</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='iglesia-infantil' className="dropdown-item-text" onClick={handleNavigation}>Iglesia Infantil</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href="matrimonio-y-familia" className="dropdown-item-text" onClick={handleNavigation}>Ministerio Matrimonio y familia</a>
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
            {/* Recursos biblicos */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Book className="mr-4 h-6 w-6" />
                  Recursos Biblicos
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <BookA className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text" >
                    <a href="/biblia" className="dropdown-item-text" onClick={handleNavigation}>
                      Biblia
                    </a>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookPlusIcon className="mr-2 h-4 w-4" />
                  <a href='/portal-biblico' className="dropdown-item-text" onClick={handleNavigation}>Portal biblico</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <a href='explicaciones-biblicas' className="dropdown-item-text" onClick={handleNavigation}>Explicaciones Biblicas</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <StarFilledIcon className="mr-2 h-4 w-4" />
                  <a href='/sermones-biblicos' className="dropdown-item-text" onClick={handleNavigation}>Sermones</a>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
            {/* Fin Recusos biblicos */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Grid className="mr-4 h-6 w-6" />
                  Quienes somos
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text" >
                    <a href="/historia" className="dropdown-item-text" onClick={handleNavigation}>
                      Historia
                    </a>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Conexión 20/30</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Misión y Visión</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/declaracion-de-fe' className="dropdown-item-text">Declaración de Fe</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Principios Doctrinales</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/principios-practicos' className="dropdown-item-text">Principios Prácticos</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/estructura' className="dropdown-item-text">Estructura</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Final de Quienes somos 
             */}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <BookOpenText className="mr-4 h-6 w-6" />
                   Estudios Biblicos 
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text" >
                    <a href="/resumen-biblico" className="dropdown-item-text" onClick={handleNavigation}>
                      Resumen biblico
                    </a>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/un-buen-liderazgo' className="dropdown-item-text">Se un lider</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='' className="dropdown-item-text">mas...</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/#' className="dropdown-item-text">mas...</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='' className="dropdown-item-text">mas...</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/#' className="dropdown-item-text">mas...</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <a href='/estructura' className="dropdown-item-text">mas...</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <ShoppingBag className="mr-4 h-6 w-6" />
              Marketplace
            </Button> */}
            <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <PlayCircle className="mr-4 h-6 w-6" />
              <a href="/playlist-music" onClick={handleNavigation}>
                PlayList Song

              </a>
            </Button>
            <Separator className="my-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Menu className="mr-4 h-6 w-6" />
                  Ver más
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Guardado</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Páginas</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Eventos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Recuerdos</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <Separator className="my-4" />
          <div className="px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={userData?.avatar_url ?? undefined} alt={userData?.display_name} className='object-cover' />
                    <AvatarFallback>
                      {user && userData?.display_name ? getInitials(userData.display_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="truncate max-w-[100px] overflow-hidden whitespace-nowrap"
                    title={userData?.display_name}
                  >
                    
                    {user ?  userData?.display_name : "Usuario"}
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className='flex justify-between'>Mi cuenta
                  <ModeToggle />
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <a href={`/profile/${user?.id}`} className='w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' onClick={handleNavigation}>
                    <span>Mi Perfil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ChatBubbleIcon className="mr-2 h-4 w-4" />
                  <a href={`/messenger`} className='w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' onClick={handleNavigation}>
                    <span>Messenger</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Ayuda y soporte</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <a
                    onClick={signOut}
                    className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cerrar sesión
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className=" mx-auto">
            {/* Botón para abrir/cerrar sidebar en dispositivos móviles */}
            <button
              className="md:hidden fixed z-50 bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page content */}
            {children}
          </div>
        </main>
      </div>
    </div>


  )
}

