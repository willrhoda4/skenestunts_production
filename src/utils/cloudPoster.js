




import CloudImage from "../components/CloudImage"





export default function cloudPoster ( poster, className ) {

    return <CloudImage
              id={  poster.cloudinary_id               }
              key={ poster.poster_id                   }
              alt={ 'movie poster for ' + poster.title }
              className={ className                    }
           />
}
