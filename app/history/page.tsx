import Header from "@/component/Home/GetStarted/Header";

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />
      <div className="h-16"/>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 moon-dance">History of Biñan</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Early Settlement */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Early Settlement</h2>
            <p className="text-gray-700 leading-relaxed">
              Before the arrival of the Spanish conquistadores in the 16th century, the shores of Laguna de Baý were already populated by settlers originating from Baý and some from the island of Mindoro. These early inhabitants engaged in trade, exchanging local agricultural products for Chinese porcelains and pottery with merchants from Guangzhou and Quanzhou.
            </p>
          </div>
        </section>

        {/* Spanish Arrival */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spanish Arrival (1571)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In June 1571, shortly after Miguel Lopez de Legazpi established Manila, his grandson, Juan de Salcedo, led an expedition to explore the eastern shores of Laguna de Baý. Accompanied by Mexican soldiers, he ventured into what was then the province of Morong, now known as Rizal. The expedition subdued the early settlements in Morong and continued toward Pagsanjan, Nagcarlan, Majayjay, and Baý in Laguna. Baý later functioned as the provincial capital until 1688.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Following their victories in southeastern Laguna, the Spanish forces sailed northwest and reached Tabuco (present-day Cabuyao). They proceeded to survey the northern territories, where they encountered strong resistance from the native inhabitants of a community in Biñan. These natives, whose primary means of livelihood were hunting and fishing, fought back using bows, arrows, and bolos. This confrontation became known as the Battle of Manlalaban, and the site was subsequently called Manlalaban—now recognized as Barangay Malaban.
            </p>
          </div>
        </section>

        {/* Spanish Victory */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Spanish Victory & Christianization</h2>
            <p className="text-gray-700 leading-relaxed">
              Despite the natives' bravery and determination, the Spaniards ultimately prevailed due to their superior weaponry and occupied the area. Capitan Juan de Salcedo, together with Padre Alfonso de Alvarado and Padre Diego Espinar, erected a large wooden cross at the present location of the San Isidro Labrador Catholic Church to commemorate their victory. The natives were then baptized and converted to Christianity.
            </p>
          </div>
        </section>

        {/* Name Origin */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Stories Behind the Name</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The origin of the name "Biñan" remains one of the town's enduring mysteries. One account suggests that it was derived from a large banyan tree (Ficus benghalensis), with the term later hispanized into "Biñan." However, because the banyan tree is uncommon in the area, this explanation gradually lost prominence and alternative theories emerged.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-orange-500 text-3xl mb-3">🌳</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Theory 1: Banyan Tree</h3>
                <p className="text-gray-600 text-sm">Derived from the large banyan tree (Ficus benghalensis), later hispanized into "Biñan."</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-green-500 text-3xl mb-3">🏪</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Theory 2: Merchant</h3>
                <p className="text-gray-600 text-sm">From the Hindu word "banyan" meaning merchant, reflecting Biñan's role as a trading center.</p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
              <div className="text-blue-500 text-3xl mb-3">✝️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Theory 3: Baptism</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Another widely cited theory traces the name to the Hindu word "banyan," which means merchant (mercader in Spanish, mangangalakal in Filipino). This interpretation reflects Biñan's early role as a trading center. Even prior to Spanish colonization, the area was already a hub for commerce, with local inhabitants actively trading with Chinese merchants through the Biñan River, which served as their primary trade route.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                A third explanation proposes that the name originated from the word "binyagan," meaning baptism. After the Spaniards defeated the local population, Capitan Juan de Salcedo and the Augustinian priests planted a cross to signify their conquest. A thanksgiving Mass followed, during which the natives were baptized and converted to Christianity. From that point onward, the place was reportedly referred to as "binyagan," or "place of baptism." Over time, the Spanish altered the pronunciation to "Biñan," giving rise to the town's present name.
              </p>
            </div>
          </div>
        </section>

        {/* Notable Facts */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Other Notable Biñan Facts</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Shaped like the number seven, Biñan covers a total land area of 43.5 square kilometers. It is the second city or municipality in Laguna when traveling from Manila. The city is bordered by San Pedro City to the north, Santa Rosa City to the south, Carmona to the west, and Laguna de Bay to the east.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl">👥</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Based on the 2015 census, Biñan has a population of 333,028, making it the fourth most populous city or municipality in Laguna, following Calamba, San Pedro City, and Santa Rosa City.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-green-50 rounded-lg">
                <div className="text-2xl">🏘️</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    The city is composed of 24 barangays, all of which are classified as urban. Barangay San Francisco is the largest in terms of land area, while Barangay Casile is the smallest.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl">⛵</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Spanish Captain Juan de Salcedo discovered and founded Biñan in June 1571, one month after Miguel López de Legazpi established Manila. His expedition included the exploration of Laguna de Bay, recognized as the largest freshwater lake in the Philippines and the second largest in Asia.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl">🏛️</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Biñan emerged as an independent town in 1688 when the provincial government seat of the Provincia de la Laguna de Bay was transferred from Bay to Pagsanjan, formally separating it from Tabuco (now Cabuyao).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl">🏙️</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    The municipality was converted into a city in 2010 through Republic Act No. 9740, ratified by residents in a plebiscite held on February 2, 2010, during the administration of then-Mayor Marlyn Alonte-Naguiat, who now serves as the city's Representative in Congress.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl">📜</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    On March 27, 2015, Biñan established its own congressional district after then-President Benigno Aquino III signed Republic Act No. 10658 into law, separating the city from Laguna's first congressional district.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl">🍰</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    The city is widely recognized for "Puto Biñan," a rice flour pancake typically topped with cheese or butter. Many residents regard the best Puto Biñan makers to be located in Barangay San Vicente.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-red-50 rounded-lg">
                <div className="text-2xl">👞</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Barangays Dela Paz and Malaban are known for their skilled shoemakers and slipper manufacturers, while Barangay Platero is renowned for its sombrero or hat makers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-teal-50 rounded-lg">
                <div className="text-2xl">🌾</div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Despite achieving city status, Biñan maintains a strong agricultural and fishing sector, with approximately 220 rice farmers, 240 vegetable farmers, and around 25,000 fishermen who regularly bring their harvest and catch to the public market situated in front of Plaza Rizal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="mb-8">
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">References:</h3>
            <div className="space-y-2">
              <a href="https://manilastandard.net/?p=229032" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                https://manilastandard.net/?p=229032
              </a>
              <a href="https://experiencebinan.com/about-binan/binans-beginnings/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                https://experiencebinan.com/about-binan/binans-beginnings/
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
