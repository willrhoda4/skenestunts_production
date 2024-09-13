





import CloudImage from "../CloudImage";




export default function posters ({currentData, demoteItem, promoteItem}) {




    // generates a poster thumbnail to be displayed in the barn.
    function makePoster (title, id, image, index) {


        // if there is no poster for said film, return nothing.
        if (image === 'no poster') { return; }

        return (

            // link to the film's IMDB page.
            <a     key={index}
                target="_blank"
                   rel="noreferrer"
                  href={'https://www.imdb.com/title/' + id + '/'}
            >
                

                <div className='barnPosterWrapper' key={index}>
                    <CloudImage
                        id={  image                       }
                        key={ index                       }
                        alt={ 'movie poster for ' + title }
                        className={ 'barnPoster'          }
                    />
                    {/* tidies up data from IMDB */}
                    <p>{title.replaceAll('&apos;',`'`).replaceAll('&amp;','&')}</p>
                </div>
            </a>

        )
    }

    return ( <>
            {/* displays whatever posters are loaded into currentData by AdminPosterBarn
                displays No Posters if ... there are no posters */}
            { currentData.length === 0 ? <h2 style={{width: '100%', textAlign: 'center', marginTop: '20vh'}}>No Posters!</h2>
                                       : <div id='barnRack'>

                                            {(  currentData && 
                                                currentData[0].hasOwnProperty('poster_id'))   &&     currentData.map((poster, index) => 
                                                
                                                                                                                        makePoster( poster.title, 
                                                                                                                                    poster.imdb_id, 
                                                                                                                                    poster.cloudinary_id, 
                                                                                                                                    index
                                                                                                                                )
                                                                                                                    )
                                            }

                                         </div>
            }

        </>)
}