


import                './Notification.css'


import iconHourGlass from '../images/icon_hourglass.svg';
import iconCheck     from '../images/icon_check.png';
import iconX         from '../images/icon_x.png';
import iconBulb      from '../images/icon_bulb.svg';





// notification box that pops up whenver extra communication is needed with the user.
export default function Notification ({type, msg}) {

    return (

        // the type prop controls the div class, determining the color of the notification box.
        // went with gray for both wait and idea. didn't want to get too crazy.
        <div className={    type==='good' ? 'good notification'
                         :  type==='bad'  ? 'bad  notification'
                         :  type==='wait' ? 'wait notification'
                         :  type==='idea' ? 'wait notification'
                         :                       'notification' 
                        } 
        >

            {/* it also controls which icon gets displayed */}
            {    type==='good' ? <img className='notificationIcon' alt='checkmark icon' src={iconCheck}      />
              :  type==='bad'  ? <img className='notificationIcon' alt='x icon'         src={iconX}          />
              :  type==='wait' ? <img className='notificationIcon' alt='hourglass icon' src={iconHourGlass}  />
              :  type==='idea' ? <img className='notificationIcon' alt='lightbulb icon' src={iconBulb}       />
              :                   null
            }

            {/* unsurpisingly, the msg prop handles the message displayed. */}
            <p className='notificationCaption' style={{whiteSpace: 'pre-line'}}>{msg}</p>
        </div>
    )
}