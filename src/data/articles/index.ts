import type { Article } from "./types";
import { article as limoCostPerHour } from "./how-much-does-a-limo-cost-per-hour";
import { article as napaWineTourLimo } from "./napa-valley-wine-tour-limo";
import { article as sfoAirportPickup } from "./sfo-airport-pickup-service";
import { article as weddingLimoCost } from "./wedding-limo-rental-san-francisco-cost";
import { article as corporateCarService } from "./corporate-car-service-san-francisco";
import { article as sfoToNapa } from "./sfo-to-napa-valley";
import { article as limoVsRideshare } from "./limo-service-vs-rideshare-cost";
import { article as earlyMorningFlight } from "./early-morning-flight-airport-ride-san-francisco";
import { article as napaVsSonoma } from "./napa-vs-sonoma-wine-tour";
import { article as oakAirportPickup } from "./oak-airport-pickup-service";
import { article as sjcAirportCarService } from "./sjc-airport-car-service";
import { article as napaOneDayItinerary } from "./napa-valley-one-day-itinerary";
import { article as sonomaWineTour } from "./sonoma-wine-tour-from-san-francisco";
import { article as designatedDriverNapa } from "./designated-driver-napa-winery-tour";
import { article as promLimoRental } from "./prom-limo-rental-bay-area";
import { article as birthdayLimo } from "./birthday-limo-rental-san-francisco";

export type { Article, ArticleBlock, ArticleFaq } from "./types";

/**
 * Published blog articles, in display order (money-first cadence from the
 * 30-topic SEO map: cost/booking intent first, then flagship services).
 * Remaining topics from the map get appended here as they publish.
 */
export const articles: Article[] = [
  limoCostPerHour,
  napaWineTourLimo,
  sfoAirportPickup,
  weddingLimoCost,
  corporateCarService,
  sfoToNapa,
  limoVsRideshare,
  earlyMorningFlight,
  napaVsSonoma,
  oakAirportPickup,
  sjcAirportCarService,
  napaOneDayItinerary,
  sonomaWineTour,
  designatedDriverNapa,
  promLimoRental,
  birthdayLimo,
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
