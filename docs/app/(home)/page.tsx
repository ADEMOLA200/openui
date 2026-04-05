import styles from "./page.module.css";
import { CompatibilitySection } from "./sections/CompatibilitySection/CompatibilitySection";
import { FeaturesSection } from "./sections/FeaturesSection/FeaturesSection";
import { Footer } from "./sections/Footer/Footer";
import { GradientDivider } from "./sections/GradientDivider/GradientDivider";
import { HeroSection } from "./sections/HeroSection/HeroSection";
import { PossibilitiesSection } from "./sections/PossibilitiesSection/PossibilitiesSection";
import { ShiroMascot } from "./sections/ShiroMascot/ShiroMascot";
import { StepsSection } from "./sections/StepsSection/StepsSection";
import { TweetWallSection } from "./sections/TweetWallSection/TweetWallSection";
import { UILibrariesSection } from "./sections/UILibrariesSection/UILibrariesSection";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <ShiroMascot />
      <StepsSection />
      <div className={styles.contentSection}>
        <GradientDivider direction="down" />
        <div className={styles.contentShell}>
          <PossibilitiesSection />
          <div className={styles.compatibilityStack}>
            <UILibrariesSection />
            <CompatibilitySection />
          </div>
          <FeaturesSection />
          <TweetWallSection />
        </div>
        <GradientDivider direction="up" />
      </div>
      <Footer />
    </div>
  );
}
