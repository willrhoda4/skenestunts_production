







/*
    this script is used to generate the options for the performer form.
    treat it delicately. it's a fragile beast.

    the order of any of columns arrays is important
    (both the order of the columns themselves, and the order of the values within each column),
    as the performer form depends on them to properly load value in state for updates.
    each array corresponds to the form page of the same number.
*/

const columns1   =  [ 'first_name', 'last_name', 'email', 'phone', 'province', 'pronouns' ];
const columns2   =  [ 'imdb_id', 'birthyear', 'headshot', 'bodyshot', 'reel_url', 'workers_union', 'weight', 'height', 'gender','eyes','hair', 'black', 'white', 'east_asian', 'indigenous', 'hispanic', 'mena', 'south_asian' ];
                                       
const columns3   =  [ 'film_fighting', 'stage_combat', 'stage_swordplay', 'boxing', 'judo', 'jiu_jitsu', 'krav_maga', 'karate', 'kung_fu', 'mma', 'muay_thai', 'capoeira', 'wrestling' ];
const columns4   =  [ 'football', 'baseball', 'basketball', 'cheerleading', 'dance', 'gymnastics', 'hockey_field', 'hockey_ice', 'hockey_street', 'lacrosse', 'rugby', 'soccer', 'softball', 'volleyball', 'tennis', 'fencing' ];
const columns5   =  [ 'stunt_driving', 'precision_driving', 'nascar', 'atv_riding', 'atv_tricks', 'motorcycle_riding', 'motorcycle_tricks', 'dirt_bike_riding', 'dirt_bike_tricks', 'bicycle_riding', 'bicycle_tricks', 'mountain_biking', 'tricycle', 'unicycle', 'rollerblading', 'snowmobiling', 'skateboarding', 'horse_bareback', 'horse_jousting', 'horse_jumping', 'horse_riding' ];
const columns6   =  [ 'occupational_diver', 'high_diving', 'freediving', 'padi',  'paddle_boarding', 'surfing', 'surfskiing', 'waterskiing', 'wakeboarding', 'canoeing', 'kayaking', 'whitewater_kayaking', 'whitewater_rafting', 'jetski_riding', 'jetski_tricks' ];
const columns7   =  [ 'skating_ice', 'skiing_alpine', 'skiing_xc', 'skiing_downhill', 'skiing_freestyle', 'skiing_jumping', 'mountain_boarding', 'snow_biking', 'snow_kiting', 'snowboarding', 'climbing_ice',       ];
const columns8   =  [ 'air_rams', 'archery_horseback', 'archery_target', 'circus_training', 'climbing_rock', 'descender_work', 'fire_burns', 'fire_safety', 'hang_gliding', 'high_falls', 'parkour', 'prosthetic_work', 'skydiving', 'slacklining', 'stair_falls', 'trampoline', 'wirework', 'stunt_actor' ];
const columns9   =  [ 'class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'air_brake', 'heavy_trailer', 'house_trailer' ];
const columns10  =  [ 'performer_notes', 'update_count', 'performer_class' ];


const columns    =  [ columns1,columns2,columns3,columns4,columns5,columns6,columns7,columns8,columns9,columns10 ];

export default function performerOptions () {

    return { province: ['Alberta', 'British Columbia', 'Manitoba','New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon', 'not a Canadian resident'],
             pronouns: ['they/them', 'she/her', 'he/him', 'other', 'prefer not to disclose'], 
                 eyes: [ 'brown', 'blue', 'grey', 'green', 'hazel' ],
                 hair: [ 'blonde', 'brunette', 'redhead', 'black', 'gray', 'bald', 'auburn', 'white' ],
                union: ['ACTRA', 'UBPC', 'SAG', 'other', 'none'],
               gender: ['cis man', 'cis woman', 'trans man', 'trans woman', 'two-spirit', 'non-binary', 'other', 'prefer not to disclose'],
              columns: columns
                    }
}






