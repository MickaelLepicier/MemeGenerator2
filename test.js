// html

<header class="menu">

<!-- <nav class="navbar"> -->
<div class="menu-bar" onclick="menuOnClick()">
  <div class="bar1 bar"></div>
  <div class="bar2 bar"></div>
  <div class="bar3 bar"></div>
</div>

<nav class="navbar">
  <!-- <ul class="nav-pages"> -->
  <ul>
    <li onclick="onNav('gallery')">Gallery</li>
    <li onclick="onNav('saved')">Saved</li>
    <li onclick="onNav('about')">About</li>
  </ul>
</nav>
</header>
<div class="menu-bg"></div>


// css


.menu-bar {
  width: 45px;
  height: 40px;
  margin: 30px 0 20px 20px;
  cursor: pointer;
}

.bar {
  height: 5px;
  width: 100%;
  background-color: #dc052d;
  display: block;
  border-radius: 5px;
  transition: 0.3s ease;
}


.bar1 {
  transform: translateY(-4px);
}

.bar3 {
  transform: translateY(4px);
}

.menu-bg,
.menu {
  top: 0;
  right: 0;
  position: absolute;
  /* width: 100%; */
}

.menu-bg {
  z-index: 1;
  width: 0;
  height: 0;
  margin: 30px 0 20px 20px;
  background: radial-gradient(circle, aquamarine, aquamarine);
  border-radius: 50%;
  transition: 0.3s ease;
}


.change {
  display: block;
}

.change .bar {
  background-color: white;
}

.change .bar1 {
  transform: translateY(4px) rotateZ(-45deg);
}

.change .bar2 {
  opacity: 0;
}

.change .bar3 {
  transform: translateY(-6px) rotateZ(45deg);
}

.change-bg {
  width: 520px;
  height: 460px;
  transform: translate(60%, -15%);
}


.menu {
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  */
  background-color: aquamarine;

  z-index: 2;
}

.navbar {
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: aquamarine; */

  /* test */

  transition: 0.3s ease;
  display: none;

  /* z-index: 2; */
}

.logo {
  margin-inline: 2vw;
}



.nav-pages {
  /* display: flex; */

  /* test */
  transition: 0.3s ease;
  display: none;
}

/* test */
.navbar ul {
  padding: 0 22px;
}

.navbar li {
  /* margin-inline: 2vw; */

  /* test */
  list-style: none;
  padding: 12px 0;
}

.navbar li a {
  color: white;
  font-size: 20px;
  text-decoration: none;
}

.navbar li a:hover {
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}


// js


