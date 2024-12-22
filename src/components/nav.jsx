import Link from "next/link";
import '../styles/nav.css';

const navItems = {
  "/": {
    name: "Home",
  },
  "/recordings": {
    name: "Recordings",
  }
};

 const Navbar = () => {
  return (
    <aside className="navigation-container">
      <div className="sticky-container">
        <nav className="navigation-bar" id="nav">
          <div className="navigation-links">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link key={path} href={path} className="navigation-link">
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default Navbar
