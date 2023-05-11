





export default function Picture ({src, type, fallback, id, className, alt}) {

    return (
        <picture>
            <source srcSet={src}       
                    type={type} 
            />
            <img    src={fallback}
                    id={id}
                    className={className}        
                    alt={alt}
            />
        </picture>
    )
}
  