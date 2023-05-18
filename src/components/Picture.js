







export default function Picture({ src, type, fallback, id, className, alt }) {

    return (
        
      <picture>

        <source  srcSet={src} 
                   type={type} 
                     id={id} 
              className={className}
                    alt={alt} />


        <img        src={fallback} 
                     id={id} 
              className={className} 
                    alt={alt} />

      </picture>

    );
  }

