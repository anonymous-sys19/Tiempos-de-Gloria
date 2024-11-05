
import { ModeToggle } from './ThemeComponents/mode-toggle'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  ShoppingBag,
  PlayCircle,
  Menu,
  Bookmark,
  Flag,
  Calendar,
  Clock,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { useAuth } from "@/hooks/userAuth"
import { useState, useEffect } from 'react'
// import Historia from './Rutas/QuienesSomos/Historia'
import { useNavigate } from 'react-router-dom'

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


const menuItems = [
  {
    name: 'Inicio',
    path: '/',
    icon: <Home className="mr-4 h-6 w-6" />,
    isButton: true,
  },
  {
    name: 'Ministerios',
    icon: <Users className="mr-4 h-6 w-6" />,
    dropdown: [
      { name: 'Ministerio del adulto mayor', path: '/adulto-mayor' },
      { name: 'Ministerio de Caballeros', path: '/caballeros' },
      { name: 'Ministerio de Damas', path: '/damas' },
      { name: 'G Emergente', path: '/g-emergente' },
      { name: 'GE Junior', path: '/ge-junior' },
      { name: 'Iglesia Infantil', path: '/iglesia-infantil' },
      { name: 'Ministerio Matrimonio y familia', path: '/matrimonio-familia' },
    ],
  },
  {
    name: 'Quienes somos',
    icon: <Grid className="mr-4 h-6 w-6" />,
    dropdown: [
      { name: 'Historia', path: '/historia' },
      { name: 'Conexión 20/30', path: '/conexion' },
      { name: 'Misión y Visión', path: '/mision-vision' },
      { name: 'Declaración de Fe', path: '/declaracion' },
      { name: 'Principios Doctrinales', path: '/doctrinales' },
      { name: 'Principios Prácticos', path: '/practicos' },
      { name: 'Estructura', path: '/estructura' },
    ],
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    icon: <ShoppingBag className="mr-4 h-6 w-6" />,
    isButton: true,
  },
  {
    name: 'PlayList Song',
    path: '/playlist-music',
    icon: <PlayCircle className="mr-4 h-6 w-6" />,
    isButton: true,
  },
  {
    name: 'Ver más',
    icon: <Menu className="mr-4 h-6 w-6" />,
    dropdown: [
      { name: 'Guardado', path: '/guardado' },
      { name: 'Páginas', path: '/paginas' },
      { name: 'Eventos', path: '/eventos' },
      { name: 'Recuerdos', path: '/recuerdos' },
    ],
  },
]



export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, session, signOut } = useAuth()
  const [isScrolled, setScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)


  const navigate = useNavigate()

  const handleNavigation = (e: { preventDefault: () => void }, path: string) => {
    e.preventDefault()  // Evita la recarga
    navigate(path)  // Navega a la ruta sin recargar

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
              <img src='public\logo-idec.png' className="h-8 w-8" />
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Buscar en Facebook"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                <AvatarFallback>{user?.user_metadata.name ? getInitials(user.user_metadata.name) : 'U'}</AvatarFallback>
              </Avatar>
              <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm font-medium lg:block">
                <span className="sr-only">Abrir menú de usuario para </span>
                {session ? user?.user_metadata.name : ""}
              </span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:translate-x-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md overflow-y-auto transition-transform duration-300 ease-in-out h-full`}>
          <nav className="mt-5 px-2 space-y-1">
            <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Home className="mr-4 h-6 w-6" />
              <a href="/" className='flex w-full items-center justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'>
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
                  <span className="dropdown-item-text">G Emergente</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">GE Junior</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Iglesia Infantil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Ministerio Matrimonio y familia</span>
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
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
                  <span className="dropdown-item-text">Declaración de Fe</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Principios Doctrinales</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Principios Prácticos</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span className="dropdown-item-text">Estructura</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <ShoppingBag className="mr-4 h-6 w-6" />
              Marketplace
            </Button>
            <Button variant="outline" className="w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
              <PlayCircle className="mr-4 h-6 w-6" />
              <a href="playlist-music">
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
                    <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.name} />
                    <AvatarFallback>
                      {user?.user_metadata.name ? getInitials(user.user_metadata.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="truncate max-w-[100px] overflow-hidden whitespace-nowrap"
                    title={user?.user_metadata.name}
                  >
                    {session ? user?.user_metadata.name : ""}
                  </span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <a href='perfil/:id' className='w-full justify-start dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'>
                    <span>Mi Perfil</span>
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