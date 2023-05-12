







from selenium                          import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by      import By
from selenium.webdriver.common.keys    import Keys
from selenium.webdriver.support.ui     import Select
from selenium.webdriver.support.ui     import WebDriverWait
from selenium.webdriver.support        import expected_conditions as EC

import sys
import time
import random



def generatePerformer ():
    
    service_object = Service('/Applications/chromedriver')
    driver =  webdriver.Chrome(service=service_object)
    wait   =  WebDriverWait(driver,10)
    driver.implicitly_wait(30)

    
    def fill_field (name, value):

        field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@name='"+name+"']")))
        field.clear()
        field.send_keys(value)
        
    def fill_text (name, value):

        textarea = wait.until(EC.presence_of_element_located((By.XPATH, "//textarea[@name='"+name+"']")))
        textarea.clear()
        textarea.send_keys(value)

        
    def upload_file (name, value):

        field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@name='"+name+"']")))
        field.clear()
        field.send_keys(value)
        field.click()

        
    def fill_select (name):
        
        select = Select(wait.until(EC.element_to_be_clickable((By.XPATH, "//select[@name='"+name+"']"))))
        select.select_by_index(random.randrange(1,len(select.options)))  


    def fill_boxes (sort):
        
        boxes        = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, sort )))
        skill_level  = 5
        for box in boxes:
            if (random.randint(0,10) < skill_level): box.click()

                
    def click_div (id):

        div = wait.until(EC.presence_of_element_located((By.ID, id )))
        div.click()


    def random_word (length):

        alphabet   = [*'abcdefghijklmnopqrstuvwxyz']
        letterList = []

        for letter in range(length):
            letterList.append(alphabet[random.randrange(26)])

        return ''.join(letterList)


    random_first_name = random_word(10).capitalize()
    random_last_name  = random_word(10).capitalize()
    random_email      = random_first_name.lower()+"@gmail.com"
    random_phone      = str(random.randint(111,999))+'-'+str(random.randint(111,999))+'-'+str(random.randint(1111,9999))
    random_imdb       = "nm"+str(random.randint(1111111,9999999))
    random_headshot   = "/Users/williamrhoda/Documents/Code/Projects/skene_stunts/test_images/headshot_"+str(random.randint(1,5))+".jpeg"
    random_bodyshot   = "/Users/williamrhoda/Documents/Code/Projects/skene_stunts/test_images/bodyshot_"+str(random.randint(1,5))+".jpeg"
    random_reel       = "https://"+random_first_name.lower()+random_last_name.lower()+".com/"
    random_class      = random.choice(["E", "D", "C"])




    driver.get("http://localhost:3001/contact")
    
    if random_class == "E":
        click_div("newContactButton")
    else:    
        click_div("performerContactButton")

    fill_field(  "first name",          random_first_name   )
    fill_field(  "last name",           random_last_name    )  
    fill_field(  "email",               random_email        )  
    fill_field(  "phone",               random_phone        )  
    fill_select( "province"                                 )
    fill_select( "pronouns"                                 )

    
    nextPage = driver.find_element(By.ID, "nextPageButton"  )
    nextPage.click()
    
    if random_class != "E":
        fill_field(  "IMDB ID",             random_imdb     ) 
        
    fill_select( "birth year"                               )
    fill_field(  "headshot",            random_headshot     )
    fill_field(  "bodyshot",            random_bodyshot     )
    
    if random_class != 'C':
        click_div("noReelBox")
    else:
        fill_field(  "URL to latest reel",  random_reel     )

    fill_select( "union"                                    )
    fill_select( "weight"                                   )
    fill_select( "height"                                   )
    fill_select( "gender"                                   )  
    fill_select( "eyes"                                     )
    fill_select( "hair"                                     )

    fill_boxes("ethnicities")

    nextPage.click()

    fill_boxes("martialArts")

    nextPage.click()

    fill_boxes("sports")

    nextPage.click()

    fill_boxes("riding")

    nextPage.click()

    fill_boxes("water")

    nextPage.click()

    fill_boxes("winter")

    nextPage.click()

    fill_boxes("other")

    nextPage.click()

    fill_boxes("driving")

    nextPage.click()
    
    fill_field(  "password",            "password"          )
    fill_text(   "what else?",          random_email        )


    wait.until(EC.presence_of_element_located((By.ID, ("formSubmitButton")))).click()
    time.sleep(10)
    driver.quit()


performer_amount = int(sys.argv[1])

for performer in range(performer_amount): generatePerformer()