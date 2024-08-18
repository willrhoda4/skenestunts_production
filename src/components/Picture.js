







export default function Picture({ src, type, fallback, id, className, alt, style }) {



    return (  <img     src={src} 
                   onError={(e) => (e.target.src = fallback)} 
                       alt={alt} 
                        id={id}
                 className={className}
                     style={ style ?? { maxWidth: '100%' }} />
         
              // this configuration may become relevant in the future,
              // but for now it just causes problems with Tor browser.
              // <picture>

              //   <source  srcSet={src} 
              //               type={type} 
              //                 id={id} 
              //         className={className}
              //             style={style}
              //               alt={alt} 
              //   />

              //   <img        src={fallback} 
              //                 id={id} 
              //         className={className}
              //             style={style} 
              //               alt={alt} 
              //   />

              // </picture>

    );
  }

