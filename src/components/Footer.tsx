import Clocks from "./Clocks";
import { site } from "@/lib/site";

/**
 * The footer carries the identity rather than closing the door on it: the
 * studio's hours, where to find it, and the name at full size.
 */
export default function Footer() {
  return (
    <footer className="gutter pb-8 pt-20">
      <hr className="rule" />

      <div className="flex flex-col gap-10 pt-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="lg:max-w-xl">
          <Clocks />
        </div>

        <div className="flex gap-10">
          <div>
            <div className="label mb-2">Follow</div>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href={site.social.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link text-[0.95rem]"
                >
                  {site.social.instagram.label} {site.social.instagram.handle}
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link text-[0.95rem]"
                >
                  {site.social.linkedin.label} {site.social.linkedin.handle}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="label mb-2">Enquiries</div>
            <a href={`mailto:${site.email}`} className="link text-[0.95rem]">
              {site.email}
            </a>
          </div>
        </div>
      </div>

      {/* The name at scale, cropped by the edge of the page. */}
      <div className="mt-16 overflow-hidden">
        <div
          className="wordmark select-none whitespace-nowrap text-[clamp(3.5rem,17vw,15rem)] leading-[0.8]"
          aria-hidden="true"
        >
          studio arama
        </div>
      </div>

      <div className="label mt-6 flex flex-wrap items-center justify-between gap-3">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>
          Founded by {site.founder}, {site.founderRole}
        </span>
      </div>
    </footer>
  );
}
