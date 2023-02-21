const hamburgerButton = document.getElementById('hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuItems = document.getElementsByClassName("mobile-link-container");
console.log(mobileMenuItems);

hamburgerButton.addEventListener('click', () => {
  hamburgerButton.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

for (let index = 0; index < mobileMenuItems.length; index++) {
  const element = mobileMenuItems[index];
  element.addEventListener('click', () => {
    hamburgerButton.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
}

mobileMenuItems[0].addEventListener('click', () => {
  document.getElementById("us").scrollIntoView({behavior: 'smooth'});
});

mobileMenuItems[1].addEventListener('click', () => {
  document.getElementById("services").scrollIntoView({behavior: 'smooth'});
});

mobileMenuItems[2].addEventListener('click', () => {
  document.getElementById("social").scrollIntoView({behavior: 'smooth'});
});

mobileMenuItems[3].addEventListener('click', () => {
  document.getElementById("location").scrollIntoView({behavior: 'smooth'});
});
