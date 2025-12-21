//upon true, changes the overflow
export const overflow = (boolean) => {
    if (boolean) {
        document.querySelector("body").style.overflow = "auto"
        document.querySelector("html").style.overflow = "auto"
    } else {
        document.querySelector("body").style.overflow = "hidden"
        document.querySelector("html").style.overflow = "hidden"
    }
}