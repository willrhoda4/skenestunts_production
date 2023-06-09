







import           './Construction.css';


import Picture  from                './Picture';


import logo     from                '../images/logo_error.webp';
import logoPng  from                '../images/logo_error.png';



// this component is a placeholder for when the site is down for maintenance.
// it's a simple page with a logo and a message.
// and can be summoned through the Director's Chair at the admin's bequest.
export default function Construction ({errorBoundary}) {


    const heading = errorBoundary ? 'Looks like someting went wrong...'
                                  : 'we\'re doing some maintenance...';

    const apology = errorBoundary ? 'Sorry about this. Try refreshing the browser, and if the problem persists send us an email.'
                                  : 'Sorry for the inconvenience. We\'re doing our best to keep the downtime short, so be sure to check back soon.';

  
    


    return(

        <div className='constructionPage'>
            
            <h2>{heading}</h2>

            <Picture
                         src={logo}
                    fallback={logoPng}
                        type='image/webp'
                         alt='Skene Stunts company logo'
                          id='errorLogo'
            />

            <p className='constructionGraf'>{apology}</p>

        </div>
    )
}