






import './Loader.css'


// this component is used to display a loading animation while the app is fetching data
// for the forward-facing site. Ideally it won't see much action, but it's there just in case.
export default function Loader () {

    return (

        <div id='loaderWrapper'>

            <div className='loader'/>

            <h2>Loading...</h2>
            
        </div>
    )
}