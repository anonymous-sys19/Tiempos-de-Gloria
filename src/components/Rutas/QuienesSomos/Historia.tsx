
import { Clock,  Heart } from 'lucide-react';

function Historia() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center space-x-3 border-b">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">ID</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Iglesia de Dios</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Publicado hace 2 horas</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Historia</h2>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>
                La Iglesia de Dios data su origen desde el día jueves 19 de agosto de 1886, 
                cuando un grupo de ocho hermanos, liderados por Richard G. Spurling, ministro 
                bautista, inconformes con la frialdad y mundanalidad de la iglesia, decidieron 
                unirse para estudiar la Biblia, orar, vivir en santidad y experimentar el 
                evangelio de poder.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="italic">
                  "restaurar el cristianismo primitivo y lograr la unión de todas las denominaciones"
                </p>
                <p className="text-sm text-gray-600 mt-2">- Conn, C., "Como Ejército Poderoso" 1995, p.7</p>
              </div>

              <p>
                Después de diez años de estudio de la Biblia y de predicar la vida de santidad 
                y la experiencia de la santificación, la pequeña iglesia experimentó el primer 
                derramamiento del Espíritu Santo; y así comenzó el gran movimiento pentecostal 
                moderno. Esto ocurrió en el año 1896.
              </p>

              <p>
                La Iglesia de Dios es la primera iglesia pentecostal de la época moderna. Una 
                década después se dio el gran avivamiento de la Calle Azusa, en California, en 
                el año 1906.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Evolución del nombre:</h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center">
                    <span className="w-16 text-sm text-gray-500">1886:</span>
                    <span className="font-medium">Unión Cristiana</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-16 text-sm text-gray-500">1902:</span>
                    <span className="font-medium">Iglesia de Santidad</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-16 text-sm text-gray-500">1907:</span>
                    <span className="font-medium">Iglesia de Dios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex justify-between text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Heart className="w-4 h-4" />
                </div>
                <span>IDEC ZONA COLORADO</span>
              </div>
              {/* <div className="flex space-x-4">
                <span>847 comentarios</span>
                <span>324 compartidos</span>
              </div> */}
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex justify-between">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Me gusta</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Comentar</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Compartir</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bookmark className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Guardar</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Historia;