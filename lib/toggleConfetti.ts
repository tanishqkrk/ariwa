export function turnConfettiOff() {
  if (document.querySelector(".confetties-iframe")) {
    console.log("%cRemoving confettis", "font-size: 36px; color:red");

    (document.querySelector(
      ".confetties-iframe",
    ) as HTMLIFrameElement)!.style.display = "none";
  }
}
export function turnConfettiOn() {
  if (document.querySelector(".confetties-iframe")) {
    console.log("%cAdding confettis", "font-size: 36px; color:green");

    (document.querySelector(
      ".confetties-iframe",
    ) as HTMLIFrameElement)!.style.display = "block";
  }
}
