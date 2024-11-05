import React from 'react';
import { JSX } from 'react/jsx-runtime';
// Componente funcional que recibe children como prop
const TextoConNegritaAutomatica: React.FC<{children: string}> = ({ children }) => {
  const regex = /#\w+/g;
  // Dividir el texto en partes con y sin hashtags
  const partes = children.split(regex);
  // Extraer los hashtags
  const hashtags = children.match(regex) || [];

  // Intercalar las partes y los hashtags
  const elementosConEstilo: JSX.Element[] = [];
  partes.forEach((parte: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: number) => {
    // No es un hashtag
    elementosConEstilo.push(<span key={index * 2}>{parte}</span>);
    // Hashtag (si existe)
    if (hashtags[index]) {
      elementosConEstilo.push(<span key={index * 2 + 1} style={{ fontWeight: 'bold' }}>{hashtags[index]}</span>);
    }
  });

  return <>{elementosConEstilo}</>;
};

export default TextoConNegritaAutomatica;
