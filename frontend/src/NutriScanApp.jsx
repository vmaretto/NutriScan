import React, { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  Check,
  X,
  Plus,
  Calendar,
  BarChart3,
  AlertCircle,
  ChevronRight,
  Clock,
  Edit2,
  Smartphone,
} from "lucide-react";

// Database simulato di piatti comuni (basato su tabelle CREA)
const foodDatabase = {
  pasta_pomodoro: {
    name: "Pasta al pomodoro",
    carbs: 65.2,
    calories: 350,
    proteins: 12.5,
    fats: 8.3,
    fiber: 3.2,
  },
  carbonara: {
    name: "Pasta alla carbonara",
    carbs: 28.4,
    calories: 420,
    proteins: 18.7,
    fats: 22.5,
    fiber: 1.8,
  },
  insalata_mista: {
    name: "Insalata mista",
    carbs: 4.2,
    calories: 45,
    proteins: 2.1,
    fats: 2.8,
    fiber: 2.5,
  },
  pollo_verdure: {
    name: "Pollo con verdure",
    carbs: 12.3,
    calories: 280,
    proteins: 32.5,
    fats: 11.2,
    fiber: 4.1,
  },
  pizza_margherita: {
    name: "Pizza margherita",
    carbs: 48.5,
    calories: 380,
    proteins: 16.2,
    fats: 14.8,
    fiber: 2.3,
  },
};

const NutriScanApp = () => {
  const [currentView, setCurrentView] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedFood, setRecognizedFood] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [foodDiary, setFoodDiary] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showMobileAlert, setShowMobileAlert] = useState(false);

  // Form per inserimento manuale
  const [manualEntry, setManualEntry] = useState({
    name: "",
    ingredients: "",
    portion: "",
    carbs: "",
    calories: "",
  });

  // Rileva se siamo su mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Simula il riconoscimento AI dell'immagine
  const recognizeFood = () => {
    setIsRecognizing(true);

    setTimeout(() => {
      // Simula risultati multipli con confidenza
      const suggestions = [
        { id: "carbonara", confidence: 0.85 },
        { id: "pasta_pomodoro", confidence: 0.65 },
      ];

      setRecognizedFood(suggestions);
      setIsRecognizing(false);
    }, 2000);
  };

  // Gestione caricamento immagine
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        recognizeFood();
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestione click su "Scatta foto"
  const handleCameraClick = (e) => {
    if (!isMobile) {
      e.preventDefault();
      setShowMobileAlert(true);
      setTimeout(() => setShowMobileAlert(false), 4000);
    }
  };

  // Conferma selezione piatto
  const confirmSelection = (foodId) => {
    const food = foodDatabase[foodId];
    const entry = {
      id: Date.now(),
      timestamp: new Date(),
      food: food,
      image: capturedImage,
    };

    setFoodDiary([...foodDiary, entry]);
    setCapturedImage(null);
    setRecognizedFood(null);
    setCurrentView("diary");
  };

  // Salva inserimento manuale
  const saveManualEntry = () => {
    const entry = {
      id: Date.now(),
      timestamp: new Date(),
      food: {
        name: manualEntry.name,
        carbs: parseFloat(manualEntry.carbs) || 0,
        calories: parseFloat(manualEntry.calories) || 0,
        proteins: 0,
        fats: 0,
        fiber: 0,
      },
      image: capturedImage,
      isManual: true,
    };

    setFoodDiary([...foodDiary, entry]);
    setShowManualEntry(false);
    setManualEntry({
      name: "",
      ingredients: "",
      portion: "",
      carbs: "",
      calories: "",
    });
    setCapturedImage(null);
    setRecognizedFood(null);
    setCurrentView("diary");
  };

  // Calcola statistiche giornaliere
  const getDailyStats = () => {
    const today = new Date().toDateString();
    const todayEntries = foodDiary.filter(
      (entry) => entry.timestamp.toDateString() === today
    );

    return todayEntries.reduce(
      (stats, entry) => ({
        carbs: stats.carbs + (entry.food.carbs || 0),
        calories: stats.calories + (entry.food.calories || 0),
        proteins: stats.proteins + (entry.food.proteins || 0),
        fats: stats.fats + (entry.food.fats || 0),
      }),
      { carbs: 0, calories: 0, proteins: 0, fats: 0 }
    );
  };

  const dailyStats = getDailyStats();

  // Raccomandazioni giornaliere
  const recommendations = {
    carbs: 300,
    calories: 2000,
    proteins: 50,
    fats: 65,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">NutriScan</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString("it-IT", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setCurrentView("camera")}
            className={`flex flex-col items-center p-2 ${
              currentView === "camera" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Camera size={24} />
            <span className="text-xs mt-1">Scansiona</span>
          </button>
          <button
            onClick={() => setCurrentView("diary")}
            className={`flex flex-col items-center p-2 ${
              currentView === "diary" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">Diario</span>
          </button>
          <button
            onClick={() => setCurrentView("stats")}
            className={`flex flex-col items-center p-2 ${
              currentView === "stats" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <BarChart3 size={24} />
            <span className="text-xs mt-1">Statistiche</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-16">
        {/* Camera/Upload View */}
        {currentView === "camera" && !capturedImage && (
          <div className="p-4 space-y-4">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-2">
                Fotografa il tuo piatto
              </h2>
              <p className="text-gray-600">
                Scatta una foto per analizzare i valori nutrizionali
              </p>
            </div>

            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <Camera size={64} className="text-gray-400" />
            </div>

            <div className="flex gap-3">
              <label
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition"
                onClick={handleCameraClick}
              >
                <Camera size={20} />
                <span>Scatta foto</span>
                {isMobile && (
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                )}
              </label>

              <label className="flex-1 bg-white border border-gray-300 py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition">
                <Upload size={20} />
                <span>Carica</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Alert per desktop */}
            {showMobileAlert && (
              <div className="fixed top-4 left-4 right-4 max-w-md mx-auto bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
                <div className="flex items-start gap-3">
                  <Smartphone size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Funzione fotocamera disponibile solo da mobile
                    </p>
                    <p className="text-sm mt-1">
                      Per scattare una foto, accedi all'app dal tuo smartphone.
                      Puoi comunque caricare un'immagine usando il pulsante
                      "Carica".
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recognition Results */}
        {capturedImage && recognizedFood && !showManualEntry && (
          <div className="p-4 space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Piatto fotografato"
                className="w-full rounded-lg"
              />
              {isRecognizing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Analizzando...</p>
                  </div>
                </div>
              )}
            </div>

            {!isRecognizing && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Cosa stai mangiando?</h3>

                {recognizedFood.map((suggestion) => {
                  const food = foodDatabase[suggestion.id];
                  return (
                    <div
                      key={suggestion.id}
                      onClick={() => setSelectedSuggestion(suggestion.id)}
                      className={`bg-white p-4 rounded-lg border-2 transition cursor-pointer ${
                        selectedSuggestion === suggestion.id
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{food.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {food.carbs}g carboidrati • {food.calories} kcal
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Confidenza:{" "}
                            {Math.round(suggestion.confidence * 100)}%
                          </p>
                        </div>
                        {selectedSuggestion === suggestion.id && (
                          <Check className="text-blue-500" size={20} />
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => setShowManualEntry(true)}
                  className="w-full bg-gray-100 p-4 rounded-lg flex items-center justify-between group hover:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <Edit2 size={20} className="text-gray-600" />
                    <span>Inserisci manualmente</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-600"
                  />
                </button>

                {selectedSuggestion && (
                  <button
                    onClick={() => confirmSelection(selectedSuggestion)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Conferma selezione
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Form */}
        {showManualEntry && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inserimento manuale</h3>
              <button onClick={() => setShowManualEntry(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome del piatto
                </label>
                <input
                  type="text"
                  value={manualEntry.name}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="es. Pasta con pesto di zucchine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredienti principali
                </label>
                <textarea
                  value={manualEntry.ingredients}
                  onChange={(e) =>
                    setManualEntry({
                      ...manualEntry,
                      ingredients: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="es. 80g pasta, 30g pesto, 20g zucchine, 10g mandorle"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carboidrati (g)
                  </label>
                  <input
                    type="number"
                    value={manualEntry.carbs}
                    onChange={(e) =>
                      setManualEntry({ ...manualEntry, carbs: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calorie (kcal)
                  </label>
                  <input
                    type="number"
                    value={manualEntry.calories}
                    onChange={(e) =>
                      setManualEntry({
                        ...manualEntry,
                        calories: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <AlertCircle size={16} className="inline mr-1" />I valori
                  nutrizionali verranno calcolati automaticamente in base agli
                  ingredienti
                </p>
              </div>

              <button
                onClick={saveManualEntry}
                disabled={!manualEntry.name}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300"
              >
                Salva piatto
              </button>
            </div>
          </div>
        )}

        {/* Food Diary View */}
        {currentView === "diary" && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Diario alimentare</h2>

            {foodDiary.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nessun pasto registrato oggi</p>
                <button
                  onClick={() => setCurrentView("camera")}
                  className="mt-4 text-blue-600 font-medium"
                >
                  Aggiungi il tuo primo pasto
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {foodDiary.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      {entry.image && (
                        <img
                          src={entry.image}
                          alt={entry.food.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{entry.food.name}</h4>
                          <span className="text-xs text-gray-500">
                            <Clock size={12} className="inline mr-1" />
                            {entry.timestamp.toLocaleTimeString("it-IT", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.food.carbs}g carb • {entry.food.calories} kcal
                        </p>
                        {entry.isManual && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            Inserito manualmente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics View */}
        {currentView === "stats" && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Riepilogo giornaliero
            </h2>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium mb-3">Valori nutrizionali</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carboidrati</span>
                    <span>
                      {dailyStats.carbs.toFixed(1)}g / {recommendations.carbs}g
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (dailyStats.carbs / recommendations.carbs) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calorie</span>
                    <span>
                      {dailyStats.calories.toFixed(0)} /{" "}
                      {recommendations.calories} kcal
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (dailyStats.calories / recommendations.calories) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Proteine</span>
                    <span>
                      {dailyStats.proteins.toFixed(1)}g /{" "}
                      {recommendations.proteins}g
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (dailyStats.proteins / recommendations.proteins) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Grassi</span>
                    <span>
                      {dailyStats.fats.toFixed(1)}g / {recommendations.fats}g
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (dailyStats.fats / recommendations.fats) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">
                Valutazione giornaliera
              </h3>
              <p className="text-sm text-green-700">
                {dailyStats.carbs < recommendations.carbs * 0.8
                  ? "I carboidrati sono sotto il livello raccomandato. Considera di aggiungere cereali integrali o frutta."
                  : dailyStats.carbs > recommendations.carbs * 1.2
                  ? "Hai superato il livello raccomandato di carboidrati per oggi."
                  : "Ottimo equilibrio di carboidrati! Continua così."}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                <AlertCircle size={16} className="inline mr-1" />
                Suggerimento per diabetici
              </h3>
              <p className="text-sm text-blue-700">
                Hai consumato {dailyStats.carbs.toFixed(1)}g di carboidrati
                oggi.
                {dailyStats.carbs > 0 &&
                  " Ricorda di monitorare la glicemia e adeguare il bolo insulinico."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutriScanApp;
