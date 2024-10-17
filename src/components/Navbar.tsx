import Link from "next/link";
import { FC } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const NavBar: FC = () => {
  const session = useSession();
  return (
    <div className="navbar bg-base-100 border-b-2 border-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/home">Home</Link>
            </li>
            <li>
              <Link href="/tierlist">Tierlist</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost text-xl" href="/home">
          DC Helper
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <Link href="/tierlist">Tierlist</Link>
          </li>
          {/* <li>
            <a href="https://www.buymeacoffee.com/8oBtn6i2fC" target="_blank">
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                width={217}
                height={60}
              />
            </a>
          </li> */}
          {session.status === "authenticated" && (
            <button onClick={() => signOut()}>Signout</button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
