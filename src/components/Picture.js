







export default function Picture({ src, type, fallback, id, className, alt, style }) {



    return (
        
      <picture>

        <source  srcSet={src} 
                    type={type} 
                      id={id} 
              className={className}
                  style={style}
                    alt={alt} 
        />

        <img        src={fallback} 
                      id={id} 
              className={className}
                  style={style} 
                    alt={alt} 
        />

      </picture>

    );
  }

