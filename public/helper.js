export function editElementCSS(el, str)
{
    el.style.cssText =  str;
}


export const textToObj = (txt) => {return {txt} }

export function getHighlightedText(obj)
{
    return obj.getHighlightedText
}



export function focusOnElement(el)
{
    const tagType = el.tagName()

    if(tagType == "TEXTAREA" || tagType ==  "INPUT"){el.focus() }
    return true;

}



export function makeInputAlert(str)
{
    window.alert(str)
}



export function setElementValue(el, val) {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = val;
        return true;
    }
    return false;
}


