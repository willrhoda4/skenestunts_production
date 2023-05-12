 
    

 

import re
import time
import json
import sys

from bs4                                import BeautifulSoup       as bs
from selenium                           import webdriver
from selenium.webdriver.chrome.service  import Service

service_object = Service('/Applications/chromedriver')
chrome_options = webdriver.ChromeOptions()

chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-blink-features=AutomationControlled')
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

driver = webdriver.Chrome(service=service_object, options=chrome_options)
driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
 
 

def getPoster(imdbCode = sys.argv[1]):
    
    driver.get('https://www.imdb.com/title/' + imdbCode + '/')
    film_soup  = bs(driver.page_source, features="lxml")
    json_dict  = json.loads( str( film_soup.findAll('script', {'type':'application/ld+json'})[0].text ))

    if 'image' in json_dict: 
        return print([json_dict['name'], imdbCode, json_dict['image']])
    else: 
        return print([json_dict['name'], imdbCode, 'no poster'])


getPoster()


 