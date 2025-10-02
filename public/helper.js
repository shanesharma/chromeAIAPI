function editElementCSS(el, str)
{
    el.style.cssText =  str;
}


function focusOnElement(el)
{
    const tagType = el.tagName()

    if(tagType == "TEXTAREA" || tagType ==  "INPUT"){el.focus() }
    return true;

}



function makeInputAlert(str)
{
    window.alert(str)
}

function makeInputAlert(str)
{
    userInput = prompt(str);
    return userInput;
    
}

function setElementValue(el, val) {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = val;
        return true;
    }
    return false;
}

