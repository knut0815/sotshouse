//////////////////////////////////////////////////////
///////////// General helper functions ///////////////
//////////////////////////////////////////////////////

//Number formats
var numFormatThree = d3.format(".3f"),
	numFormatTwo = d3.format(".2f"),
	numFormatOne = d3.format(".1f"),
	numFormatSI = d3.format(".2s"),
	numFormatPercent = d3.format(".0%"),
	numFormatPercentDec = d3.format(".1%"),
	numFormatCurrency = d3.format("$,"),
	numFormatThousands = d3.format("0,000");

var NL = d3.locale({ 
	decimal: ",", 
	thousands: ".", 
	grouping: [3], 
	currency: ["", " €"], 
	dateTime: "%A, %e de %B de %Y, %X", 
	date: "%d/%m/%Y", 
	time: "%H:%M:%S", 
	periods: ["AM", "PM"], 
	days: ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag","zondag"], 
	shortDays: ["ma", "di", "woe", "do", "vrij", "za", "zon"], 
	months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "october", "november", "december"], 
	shortMonths: ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"] 
	}); 
	
var NLformat = NL.numberFormat("n");
		
// Function to check if the variable is a function or not
function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
	
//Check if string cls is contained in class
function hasClass(element, cls) {
    return (' ' + element.attr("class") + ' ').indexOf(' ' + cls + ' ') > -1;
}

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrap(text, width) {
    var text = d3.select(this[0][0]),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, 
        y = text.attr("y"),
		x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      };
    };  
};

//////////////////////////////////////////////////////
//////////// Data on counties for Treemap ////////////
//////////////////////////////////////////////////////

var provinciesTree = 
{
"name": "Nederland",
"children": [
  {
   "name": "Drenthe",
   "children": [
    {"name": "Emmen", "GM_NAAM": "Emmen", "GM_CODE": "GM0114", "potentie_leegstand_m2": 6550, "perc_groei_trans": 0.031176471, "order": 9},
    {"name": "Hoogeveen", "GM_NAAM": "Hoogeveen", "GM_CODE": "GM0118", "potentie_leegstand_m2": 6995, "perc_groei_trans": 0.058, "order": 10},
    {"name": "Meppel", "GM_NAAM": "Meppel", "GM_CODE": "GM0119", "potentie_leegstand_m2": 11295, "perc_groei_trans": 0.078333333, "order": 11},
    {"name": "Assen", "GM_NAAM": "Assen", "GM_CODE": "GM0106", "potentie_leegstand_m2": 13885, "perc_groei_trans": 0.0456, "order": 12}
   ]
  },
  {
   "name": "Flevoland",
   "children": [
    {"name": "Noordoostpolder", "GM_NAAM": "Noordoostpolder", "GM_CODE": "GM0171", "potentie_leegstand_m2": 750, "perc_groei_trans": 0.006, "order": 3},
    {"name": "Dronten", "GM_NAAM": "Dronten", "GM_CODE": "GM0303", "potentie_leegstand_m2": 1700, "perc_groei_trans": 0.004827586, "order": 4},
    {"name": "Lelystad", "GM_NAAM": "Lelystad", "GM_CODE": "GM0995", "potentie_leegstand_m2": 8730, "perc_groei_trans": 0.016904762, "order": 5},
    {"name": "Almere", "GM_NAAM": "Almere", "GM_CODE": "GM0034", "potentie_leegstand_m2": 9910, "perc_groei_trans": 0.004270833, "order": 6}
   ]
  },
  {
   "name": "Friesland",
   "children": [
    {"name": "Sudwest-Fryslan", "GM_NAAM": "Sudwest-Fryslan", "GM_CODE": "GM1900", "potentie_leegstand_m2": 1060, "perc_groei_trans": 0.003333333, "order": 21},
    {"name": "Smallingerland", "GM_NAAM": "Smallingerland", "GM_CODE": "GM0090", "potentie_leegstand_m2": 3090, "perc_groei_trans": 0.019230769, "order": 22},
    {"name": "Heerenveen", "GM_NAAM": "Heerenveen", "GM_CODE": "GM0074", "potentie_leegstand_m2": 9890, "perc_groei_trans": 0.10125, "order": 23},
    {"name": "Leeuwarden", "GM_NAAM": "Leeuwarden", "GM_CODE": "GM0080", "potentie_leegstand_m2": 41855, "perc_groei_trans": 0.099142857, "order": 24}
   ]
  },
  {
   "name": "Gelderland",
   "children": [
    {"name": "Beuningen", "GM_NAAM": "Beuningen", "GM_CODE": "GM0209", "potentie_leegstand_m2": 550, "perc_groei_trans": 0.005714286, "order": 37},
    {"name": "Barneveld", "GM_NAAM": "Barneveld", "GM_CODE": "GM0203", "potentie_leegstand_m2": 650, "perc_groei_trans": 0.001724138, "order": 38},
    {"name": "Duiven", "GM_NAAM": "Duiven", "GM_CODE": "GM0226", "potentie_leegstand_m2": 730, "perc_groei_trans": 0.01, "order": 39},
    {"name": "Oost Gelre", "GM_NAAM": "Oost Gelre", "GM_CODE": "GM1586", "potentie_leegstand_m2": 1200, "perc_groei_trans": 0.025, "order": 40},
    {"name": "Culemborg", "GM_NAAM": "Culemborg", "GM_CODE": "GM0216", "potentie_leegstand_m2": 1550, "perc_groei_trans": 0.006666667, "order": 41},
    {"name": "Zevenaar", "GM_NAAM": "Zevenaar", "GM_CODE": "GM0299", "potentie_leegstand_m2": 1620, "perc_groei_trans": 0.018571429, "order": 42},
    {"name": "Renkum", "GM_NAAM": "Renkum", "GM_CODE": "GM0274", "potentie_leegstand_m2": 1985, "perc_groei_trans": 0.026666667, "order": 43},
    {"name": "Harderwijk", "GM_NAAM": "Harderwijk", "GM_CODE": "GM0243", "potentie_leegstand_m2": 2250, "perc_groei_trans": 0.008571429, "order": 44},
    {"name": "Overbetuwe", "GM_NAAM": "Overbetuwe", "GM_CODE": "GM1734", "potentie_leegstand_m2": 2375, "perc_groei_trans": 0.0095, "order": 45},
    {"name": "Nijkerk", "GM_NAAM": "Nijkerk", "GM_CODE": "GM0267", "potentie_leegstand_m2": 3850, "perc_groei_trans": 0.018823529, "order": 46},
    {"name": "Lochem", "GM_NAAM": "Lochem", "GM_CODE": "GM0262", "potentie_leegstand_m2": 4430, "perc_groei_trans": 0.045, "order": 47},
    {"name": "Tiel", "GM_NAAM": "Tiel", "GM_CODE": "GM0281", "potentie_leegstand_m2": 5530, "perc_groei_trans": 0.0225, "order": 48},
    {"name": "Doetinchem", "GM_NAAM": "Doetinchem", "GM_CODE": "GM0222", "potentie_leegstand_m2": 8180, "perc_groei_trans": 0.074444444, "order": 49},
    {"name": "Winterswijk", "GM_NAAM": "Winterswijk", "GM_CODE": "GM0294", "potentie_leegstand_m2": 8620, "perc_groei_trans": 0.142, "order": 50},
    {"name": "Ede", "GM_NAAM": "Ede", "GM_CODE": "GM0228", "potentie_leegstand_m2": 8885, "perc_groei_trans": 0.015, "order": 51},
    {"name": "Zutphen", "GM_NAAM": "Zutphen", "GM_CODE": "GM0301", "potentie_leegstand_m2": 9315, "perc_groei_trans": 0.076, "order": 52},
    {"name": "Rheden", "GM_NAAM": "Rheden", "GM_CODE": "GM0275", "potentie_leegstand_m2": 11645, "perc_groei_trans": 0.12125, "order": 53},
    {"name": "Nijmegen", "GM_NAAM": "Nijmegen", "GM_CODE": "GM0268", "potentie_leegstand_m2": 15665, "perc_groei_trans": 0.015176471, "order": 54},
    {"name": "Arnhem", "GM_NAAM": "Arnhem", "GM_CODE": "GM0202", "potentie_leegstand_m2": 86440, "perc_groei_trans": 0.119833333, "order": 55},
    {"name": "Apeldoorn", "GM_NAAM": "Apeldoorn", "GM_CODE": "GM0200", "potentie_leegstand_m2": 101890, "perc_groei_trans": 0.21175, "order": 56}
   ]
  },
  {
   "name": "Groningen",
   "children": [
    {"name": "Haren", "GM_NAAM": "Haren", "GM_CODE": "GM0017", "potentie_leegstand_m2": 3200, "perc_groei_trans": 0.086666667, "order": 21},
    {"name": "Hoogezand-Sappemeer", "GM_NAAM": "Hoogezand-Sappemeer", "GM_CODE": "GM0018", "potentie_leegstand_m2": 4450, "perc_groei_trans": 0.12, "order": 22},
    {"name": "Groningen", "GM_NAAM": "Groningen", "GM_CODE": "GM0014", "potentie_leegstand_m2": 54220, "perc_groei_trans": 0.02195122, "order": 23}
   ]
  },
  {
   "name": "Limburg",
   "children": [
    {"name": "Gennep", "GM_NAAM": "Gennep", "GM_CODE": "GM0907", "potentie_leegstand_m2": 735, "perc_groei_trans": 0.06, "order": 22},
    {"name": "Peel En Maas", "GM_NAAM": "Peel En Maas", "GM_CODE": "GM1894", "potentie_leegstand_m2": 1680, "perc_groei_trans": 0.015555556, "order": 23},
    {"name": "Beek", "GM_NAAM": "Beek", "GM_CODE": "GM0888", "potentie_leegstand_m2": 2130, "perc_groei_trans": 0.17, "order": 24},
    {"name": "Sittard-Geleen", "GM_NAAM": "Sittard-Geleen", "GM_CODE": "GM1883", "potentie_leegstand_m2": 3350, "perc_groei_trans": 0.054, "order": 27},
    {"name": "Venray", "GM_NAAM": "Venray", "GM_CODE": "GM0984", "potentie_leegstand_m2": 5020, "perc_groei_trans": 0.045555556, "order": 28},
    {"name": "Weert", "GM_NAAM": "Weert", "GM_CODE": "GM0988", "potentie_leegstand_m2": 5910, "perc_groei_trans": 0.049, "order": 29},
    {"name": "Venlo", "GM_NAAM": "Venlo", "GM_CODE": "GM0983", "potentie_leegstand_m2": 11900, "perc_groei_trans": 0.107777778, "order": 30},
    {"name": "Roermond", "GM_NAAM": "Roermond", "GM_CODE": "GM0957", "potentie_leegstand_m2": 27470, "perc_groei_trans": 0.151333333, "order": 31},
    {"name": "Maastricht", "GM_NAAM": "Maastricht", "GM_CODE": "GM0935", "potentie_leegstand_m2": 38915, "perc_groei_trans": 0.268333333, "order": 33}
   ]
  },
  {
   "name": "Noord-Brabant",
   "children": [
    {"name": "Boxtel", "GM_NAAM": "Boxtel", "GM_CODE": "GM0757", "potentie_leegstand_m2": 545, "perc_groei_trans": 0.004, "order": 52},
    {"name": "Veldhoven", "GM_NAAM": "Veldhoven", "GM_CODE": "GM0861", "potentie_leegstand_m2": 1415, "perc_groei_trans": 0.006875, "order": 53},
    {"name": "Waalre", "GM_NAAM": "Waalre", "GM_CODE": "GM0866", "potentie_leegstand_m2": 1815, "perc_groei_trans": 0.0375, "order": 54},
    {"name": "Vught", "GM_NAAM": "Vught", "GM_CODE": "GM0865", "potentie_leegstand_m2": 2225, "perc_groei_trans": 0.03, "order": 55},
    {"name": "Uden", "GM_NAAM": "Uden", "GM_CODE": "GM0856", "potentie_leegstand_m2": 4300, "perc_groei_trans": 0.0175, "order": 56},
    {"name": "Waalwijk", "GM_NAAM": "Waalwijk", "GM_CODE": "GM0867", "potentie_leegstand_m2": 5415, "perc_groei_trans": 0.0225, "order": 57},
    {"name": "Etten-Leur", "GM_NAAM": "Etten-Leur", "GM_CODE": "GM0777", "potentie_leegstand_m2": 6575, "perc_groei_trans": 0.035333333, "order": 58},
    {"name": "Bergen Op Zoom", "GM_NAAM": "Bergen Op Zoom", "GM_CODE": "GM0748", "potentie_leegstand_m2": 8575, "perc_groei_trans": 0.024137931, "order": 59},
    {"name": "Tilburg", "GM_NAAM": "Tilburg", "GM_CODE": "GM0855", "potentie_leegstand_m2": 10155, "perc_groei_trans": 0.008453608, "order": 60},
    {"name": "Roosendaal", "GM_NAAM": "Roosendaal", "GM_CODE": "GM1674", "potentie_leegstand_m2": 12045, "perc_groei_trans": 0.043043478, "order": 61},
    {"name": "Gilze En Rijen", "GM_NAAM": "Gilze En Rijen", "GM_CODE": "GM0784", "potentie_leegstand_m2": 12900, "perc_groei_trans": 0.107, "order": 62},
    {"name": "Oss", "GM_NAAM": "Oss", "GM_CODE": "GM0828", "potentie_leegstand_m2": 13340, "perc_groei_trans": 0.03516129, "order": 63},
    {"name": "Breda", "GM_NAAM": "Breda", "GM_CODE": "GM0758", "potentie_leegstand_m2": 25600, "perc_groei_trans": 0.029859155, "order": 64},
    {"name": "S Hertogenbosch", "GM_NAAM": "S Hertogenbosch", "GM_CODE": "GM0796", "potentie_leegstand_m2": 25660, "perc_groei_trans": 0.037368421, "order": 65},
    {"name": "Helmond", "GM_NAAM": "Helmond", "GM_CODE": "GM0794", "potentie_leegstand_m2": 26160, "perc_groei_trans": 0.051428571, "order": 66},
    {"name": "Eindhoven", "GM_NAAM": "Eindhoven", "GM_CODE": "GM0772", "potentie_leegstand_m2": 67050, "perc_groei_trans": 0.0871875, "order": 67}
   ]
  },
  {
   "name": "Noord-Holland",
   "children": [
    {"name": "Edam-Volendam", "GM_NAAM": "Edam-Volendam", "GM_CODE": "GM0385", "potentie_leegstand_m2": 910, "perc_groei_trans": 0.005833333, "order": 31},
    {"name": "Bussum", "GM_NAAM": "Bussum", "GM_CODE": "GM0381", "potentie_leegstand_m2": 1510, "perc_groei_trans": 0.010909091, "order": 32},
    {"name": "Aalsmeer", "GM_NAAM": "Aalsmeer", "GM_CODE": "GM0358", "potentie_leegstand_m2": 1640, "perc_groei_trans": 0.008125, "order": 33},
    {"name": "Hollands Kroon", "GM_NAAM": "Hollands Kroon", "GM_CODE": "GM1911", "potentie_leegstand_m2": 1865, "perc_groei_trans": 0.013636364, "order": 34},
    {"name": "Purmerend", "GM_NAAM": "Purmerend", "GM_CODE": "GM0439", "potentie_leegstand_m2": 3200, "perc_groei_trans": 0.013, "order": 35},
    {"name": "Den Helder", "GM_NAAM": "Den Helder", "GM_CODE": "GM0400", "potentie_leegstand_m2": 3230, "perc_groei_trans": 0.086666667, "order": 36},
    {"name": "Velsen", "GM_NAAM": "Velsen", "GM_CODE": "GM0453", "potentie_leegstand_m2": 3500, "perc_groei_trans": 0.016111111, "order": 37},
    {"name": "Naarden", "GM_NAAM": "Naarden", "GM_CODE": "GM0425", "potentie_leegstand_m2": 3860, "perc_groei_trans": 0.051666667, "order": 38},
    {"name": "Heerhugowaard", "GM_NAAM": "Heerhugowaard", "GM_CODE": "GM0398", "potentie_leegstand_m2": 4875, "perc_groei_trans": 0.0156, "order": 39},
    {"name": "Beverwijk", "GM_NAAM": "Beverwijk", "GM_CODE": "GM0375", "potentie_leegstand_m2": 5720, "perc_groei_trans": 0.029375, "order": 40},
    {"name": "Heemstede", "GM_NAAM": "Heemstede", "GM_CODE": "GM0397", "potentie_leegstand_m2": 6170, "perc_groei_trans": 0.06375, "order": 41},
    {"name": "Weesp", "GM_NAAM": "Weesp", "GM_CODE": "GM0457", "potentie_leegstand_m2": 6550, "perc_groei_trans": 0.028421053, "order": 42},
    {"name": "Uithoorn", "GM_NAAM": "Uithoorn", "GM_CODE": "GM0451", "potentie_leegstand_m2": 7500, "perc_groei_trans": 0.056363636, "order": 43},
    {"name": "Hoorn", "GM_NAAM": "Hoorn", "GM_CODE": "GM0405", "potentie_leegstand_m2": 8120, "perc_groei_trans": 0.025769231, "order": 44},
    {"name": "Diemen", "GM_NAAM": "Diemen", "GM_CODE": "GM0384", "potentie_leegstand_m2": 10045, "perc_groei_trans": 0.030740741, "order": 45},
    {"name": "Alkmaar", "GM_NAAM": "Alkmaar", "GM_CODE": "GM0361", "potentie_leegstand_m2": 10535, "perc_groei_trans": 0.024857143, "order": 46},
    {"name": "Huizen", "GM_NAAM": "Huizen", "GM_CODE": "GM0406", "potentie_leegstand_m2": 12910, "perc_groei_trans": 0.089166667, "order": 47},
    {"name": "Zaanstad", "GM_NAAM": "Zaanstad", "GM_CODE": "GM0479", "potentie_leegstand_m2": 20815, "perc_groei_trans": 0.025294118, "order": 48},
    {"name": "Haarlem", "GM_NAAM": "Haarlem", "GM_CODE": "GM0392", "potentie_leegstand_m2": 38920, "perc_groei_trans": 0.048208955, "order": 49},
    {"name": "Hilversum", "GM_NAAM": "Hilversum", "GM_CODE": "GM0402", "potentie_leegstand_m2": 82270, "perc_groei_trans": 0.235862069, "order": 50},
    {"name": "Haarlemmermeer", "GM_NAAM": "Haarlemmermeer", "GM_CODE": "GM0394", "potentie_leegstand_m2": 107135, "perc_groei_trans": 0.09185567, "order": 51},
    {"name": "Amstelveen", "GM_NAAM": "Amstelveen", "GM_CODE": "GM0362", "potentie_leegstand_m2": 110275, "perc_groei_trans": 0.19125, "order": 52},
    {"name": "Amsterdam", "GM_NAAM": "Amsterdam", "GM_CODE": "GM0363", "potentie_leegstand_m2": 292155, "perc_groei_trans": 0.067396122, "order": 53}
   ]
  },
  {
   "name": "Overijssel",
   "children": [
    {"name": "Steenwijkerland", "GM_NAAM": "Steenwijkerland", "GM_CODE": "GM1708", "potentie_leegstand_m2": 650, "perc_groei_trans": 0.004166667, "order": 15},
    {"name": "Borne", "GM_NAAM": "Borne", "GM_CODE": "GM0147", "potentie_leegstand_m2": 720, "perc_groei_trans": 0.005454545, "order": 16},
    {"name": "Hof Van Twente", "GM_NAAM": "Hof Van Twente", "GM_CODE": "GM1735", "potentie_leegstand_m2": 760, "perc_groei_trans": 0.008571429, "order": 17},
    {"name": "Hardenberg", "GM_NAAM": "Hardenberg", "GM_CODE": "GM0160", "potentie_leegstand_m2": 960, "perc_groei_trans": 0.004210526, "order": 18},
    {"name": "Rijssen-Holten", "GM_NAAM": "Rijssen-Holten", "GM_CODE": "GM1742", "potentie_leegstand_m2": 2045, "perc_groei_trans": 0.022857143, "order": 19},
    {"name": "Deventer", "GM_NAAM": "Deventer", "GM_CODE": "GM0150", "potentie_leegstand_m2": 5950, "perc_groei_trans": 0.014848485, "order": 20},
    {"name": "Oldenzaal", "GM_NAAM": "Oldenzaal", "GM_CODE": "GM0173", "potentie_leegstand_m2": 6160, "perc_groei_trans": 0.045454545, "order": 21},
    {"name": "Hengelo", "GM_NAAM": "Hengelo", "GM_CODE": "GM0164", "potentie_leegstand_m2": 15790, "perc_groei_trans": 0.076470588, "order": 22},
    {"name": "Almelo", "GM_NAAM": "Almelo", "GM_CODE": "GM0141", "potentie_leegstand_m2": 18480, "perc_groei_trans": 0.0612, "order": 23},
    {"name": "Enschede", "GM_NAAM": "Enschede", "GM_CODE": "GM0153", "potentie_leegstand_m2": 32660, "perc_groei_trans": 0.079411765, "order": 24},
    {"name": "Zwolle", "GM_NAAM": "Zwolle", "GM_CODE": "GM0193", "potentie_leegstand_m2": 39655, "perc_groei_trans": 0.04969697, "order": 25}
   ]
  },
  {
   "name": "Utrecht",
   "children": [
    {"name": "De Bilt", "GM_NAAM": "De Bilt", "GM_CODE": "GM0310", "potentie_leegstand_m2": 1000, "perc_groei_trans": 0.011428571, "order": 13},
    {"name": "Baarn", "GM_NAAM": "Baarn", "GM_CODE": "GM0308", "potentie_leegstand_m2": 1200, "perc_groei_trans": 0.014285714, "order": 14},
    {"name": "Utrechtse Heuvelrug", "GM_NAAM": "Utrechtse Heuvelrug", "GM_CODE": "GM1581", "potentie_leegstand_m2": 2485, "perc_groei_trans": 0.025, "order": 15},
    {"name": "Houten", "GM_NAAM": "Houten", "GM_CODE": "GM0321", "potentie_leegstand_m2": 2580, "perc_groei_trans": 0.01, "order": 16},
    {"name": "Woudenberg", "GM_NAAM": "Woudenberg", "GM_CODE": "GM0351", "potentie_leegstand_m2": 2845, "perc_groei_trans": 0.024444444, "order": 17},
    {"name": "Soest", "GM_NAAM": "Soest", "GM_CODE": "GM0342", "potentie_leegstand_m2": 3580, "perc_groei_trans": 0.019333333, "order": 18},
    {"name": "Leusden", "GM_NAAM": "Leusden", "GM_CODE": "GM0327", "potentie_leegstand_m2": 8855, "perc_groei_trans": 0.09125, "order": 19},
    {"name": "Bunnik", "GM_NAAM": "Bunnik", "GM_CODE": "GM0312", "potentie_leegstand_m2": 13550, "perc_groei_trans": 0.093333333, "order": 20},
    {"name": "Zeist", "GM_NAAM": "Zeist", "GM_CODE": "GM0355", "potentie_leegstand_m2": 14385, "perc_groei_trans": 0.031315789, "order": 21},
    {"name": "Veenendaal", "GM_NAAM": "Veenendaal", "GM_CODE": "GM0345", "potentie_leegstand_m2": 19485, "perc_groei_trans": 0.061923077, "order": 22},
    {"name": "Nieuwegein", "GM_NAAM": "Nieuwegein", "GM_CODE": "GM0356", "potentie_leegstand_m2": 27380, "perc_groei_trans": 0.102727273, "order": 23},
    {"name": "Stichtse Vecht", "GM_NAAM": "Stichtse Vecht", "GM_CODE": "GM1904", "potentie_leegstand_m2": 27500, "perc_groei_trans": 0.19, "order": 24},
    {"name": "Amersfoort", "GM_NAAM": "Amersfoort", "GM_CODE": "GM0307", "potentie_leegstand_m2": 37885, "perc_groei_trans": 0.044366197, "order": 25},
    {"name": "Utrecht", "GM_NAAM": "Utrecht", "GM_CODE": "GM0344", "potentie_leegstand_m2": 91485, "perc_groei_trans": 0.029230769, "order": 26}
   ]
  },
  {
   "name": "Zeeland",
   "children": [
    {"name": "Schouwen-Duiveland", "GM_NAAM": "Schouwen-Duiveland", "GM_CODE": "GM1676", "potentie_leegstand_m2": 1575, "perc_groei_trans": 0.024, "order": 10},
    {"name": "Middelburg", "GM_NAAM": "Middelburg", "GM_CODE": "GM0687", "potentie_leegstand_m2": 10515, "perc_groei_trans": 0.087, "order": 13}
   ]
  },
  {
   "name": "Zuid-Holland",
   "children": [
    {"name": "Sliedrecht", "GM_NAAM": "Sliedrecht", "GM_CODE": "GM0610", "potentie_leegstand_m2": 650, "perc_groei_trans": 0.005555556, "order": 33},
    {"name": "Brielle", "GM_NAAM": "Brielle", "GM_CODE": "GM0501", "potentie_leegstand_m2": 760, "perc_groei_trans": 0.008571429, "order": 34},
    {"name": "Krimpen Aan Den Ijssel", "GM_NAAM": "Krimpen Aan Den Ijssel", "GM_CODE": "GM0542", "potentie_leegstand_m2": 780, "perc_groei_trans": 0.006666667, "order": 35},
    {"name": "Albrandswaard", "GM_NAAM": "Albrandswaard", "GM_CODE": "GM0613", "potentie_leegstand_m2": 1045, "perc_groei_trans": 0.008, "order": 36},
    {"name": "Gorinchem", "GM_NAAM": "Gorinchem", "GM_CODE": "GM0512", "potentie_leegstand_m2": 1160, "perc_groei_trans": 0.012857143, "order": 37},
    {"name": "Alblasserdam", "GM_NAAM": "Alblasserdam", "GM_CODE": "GM0482", "potentie_leegstand_m2": 1400, "perc_groei_trans": 0.018333333, "order": 38},
    {"name": "Pijnacker-Nootdorp", "GM_NAAM": "Pijnacker-Nootdorp", "GM_CODE": "GM1926", "potentie_leegstand_m2": 1400, "perc_groei_trans": 0.0022, "order": 39},
    {"name": "Hardinxveld-Giessendam", "GM_NAAM": "Hardinxveld-Giessendam", "GM_CODE": "GM0523", "potentie_leegstand_m2": 1500, "perc_groei_trans": 0.024, "order": 40},
    {"name": "Katwijk", "GM_NAAM": "Katwijk", "GM_CODE": "GM0537", "potentie_leegstand_m2": 1705, "perc_groei_trans": 0.003043478, "order": 41},
    {"name": "Noordwijk", "GM_NAAM": "Noordwijk", "GM_CODE": "GM0575", "potentie_leegstand_m2": 1970, "perc_groei_trans": 0.012307692, "order": 42},
    {"name": "Nieuwkoop", "GM_NAAM": "Nieuwkoop", "GM_CODE": "GM0569", "potentie_leegstand_m2": 2450, "perc_groei_trans": 0.033333333, "order": 43},
    {"name": "Bodegraven-Reeuwijk", "GM_NAAM": "Bodegraven-Reeuwijk", "GM_CODE": "GM1901", "potentie_leegstand_m2": 3145, "perc_groei_trans": 0.052, "order": 44},
    {"name": "Oud-Beijerland", "GM_NAAM": "Oud-Beijerland", "GM_CODE": "GM0584", "potentie_leegstand_m2": 3500, "perc_groei_trans": 0.0725, "order": 45},
    {"name": "Lisse", "GM_NAAM": "Lisse", "GM_CODE": "GM0553", "potentie_leegstand_m2": 3650, "perc_groei_trans": 0.0375, "order": 46},
    {"name": "Zuidplas", "GM_NAAM": "Zuidplas", "GM_CODE": "GM1892", "potentie_leegstand_m2": 4550, "perc_groei_trans": 0.015416667, "order": 47},
    {"name": "Ridderkerk", "GM_NAAM": "Ridderkerk", "GM_CODE": "GM0597", "potentie_leegstand_m2": 5280, "perc_groei_trans": 0.044, "order": 48},
    {"name": "Waddinxveen", "GM_NAAM": "Waddinxveen", "GM_CODE": "GM0627", "potentie_leegstand_m2": 5600, "perc_groei_trans": 0.038333333, "order": 49},
    {"name": "Capelle Aan Den Ijssel", "GM_NAAM": "Capelle Aan Den Ijssel", "GM_CODE": "GM0502", "potentie_leegstand_m2": 6790, "perc_groei_trans": 0.07, "order": 50},
    {"name": "Kaag En Braassem", "GM_NAAM": "Kaag En Braassem", "GM_CODE": "GM1884", "potentie_leegstand_m2": 8930, "perc_groei_trans": 0.066363636, "order": 51},
    {"name": "Alphen Aan Den Rijn", "GM_NAAM": "Alphen Aan Den Rijn", "GM_CODE": "GM0484", "potentie_leegstand_m2": 9970, "perc_groei_trans": 0.058571429, "order": 52},
    {"name": "Zwijndrecht", "GM_NAAM": "Zwijndrecht", "GM_CODE": "GM0642", "potentie_leegstand_m2": 11045, "perc_groei_trans": 0.13, "order": 53},
    {"name": "Delft", "GM_NAAM": "Delft", "GM_CODE": "GM0503", "potentie_leegstand_m2": 12050, "perc_groei_trans": 0.014347826, "order": 54},
    {"name": "Spijkenisse", "GM_NAAM": "Spijkenisse", "GM_CODE": "GM0612", "potentie_leegstand_m2": 12220, "perc_groei_trans": 0.112222222, "order": 55},
    {"name": "Leiderdorp", "GM_NAAM": "Leiderdorp", "GM_CODE": "GM0547", "potentie_leegstand_m2": 12470, "perc_groei_trans": 0.12875, "order": 56},
    {"name": "Schiedam", "GM_NAAM": "Schiedam", "GM_CODE": "GM0606", "potentie_leegstand_m2": 17070, "perc_groei_trans": 0.082941176, "order": 57},
    {"name": "Leidschendam-Voorburg", "GM_NAAM": "Leidschendam-Voorburg", "GM_CODE": "GM1916", "potentie_leegstand_m2": 27875, "perc_groei_trans": 0.085185185, "order": 58},
    {"name": "Rijswijk", "GM_NAAM": "Rijswijk", "GM_CODE": "GM0603", "potentie_leegstand_m2": 34980, "perc_groei_trans": 0.0453125, "order": 59},
    {"name": "Zoetermeer", "GM_NAAM": "Zoetermeer", "GM_CODE": "GM0637", "potentie_leegstand_m2": 46195, "perc_groei_trans": 0.1532, "order": 60},
    {"name": "Dordrecht", "GM_NAAM": "Dordrecht", "GM_CODE": "GM0505", "potentie_leegstand_m2": 46940, "perc_groei_trans": 0.129666667, "order": 61},
    {"name": "Leiden", "GM_NAAM": "Leiden", "GM_CODE": "GM0546", "potentie_leegstand_m2": 49705, "perc_groei_trans": 0.077924528, "order": 62},
    {"name": "Gouda", "GM_NAAM": "Gouda", "GM_CODE": "GM0513", "potentie_leegstand_m2": 71225, "perc_groei_trans": 0.179393939, "order": 63},
    {"name": "S Gravenhage", "GM_NAAM": "S Gravenhage", "GM_CODE": "GM0518", "potentie_leegstand_m2": 349055, "perc_groei_trans": 0.160607735, "order": 64},
    {"name": "Rotterdam", "GM_NAAM": "Rotterdam", "GM_CODE": "GM0599", "potentie_leegstand_m2": 349590, "perc_groei_trans": 0.253217391, "order": 65}
   ]
  }
 ]
};

//////////////////////////////////////////////////////
/////////// Data on counties for Map NL //////////////
//////////////////////////////////////////////////////

var gemeentes = [
{
    "GM_NAAM": "Rotterdam",
    "GM_CODE": "GM0599",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 2912,
    "behoefte_woningen": 11500,
    "perc_groei_trans": 0.253
},
{
    "GM_NAAM": "'s Gravenhage",
    "GM_CODE": "GM0518",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 2907,
    "behoefte_woningen": 18100,
    "perc_groei_trans": 0.161
},
{
    "GM_NAAM": "Amsterdam",
    "GM_CODE": "GM0363",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 2433,
    "behoefte_woningen": 36100,
    "perc_groei_trans": 0.067
},
{
    "GM_NAAM": "Amstelveen",
    "GM_CODE": "GM0362",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 918,
    "behoefte_woningen": 4800,
    "perc_groei_trans": 0.191
},
{
    "GM_NAAM": "Haarlemmermeer",
    "GM_CODE": "GM0394",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 891,
    "behoefte_woningen": 9700,
    "perc_groei_trans": 0.092
},
{
    "GM_NAAM": "Apeldoorn",
    "GM_CODE": "GM0200",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 847,
    "behoefte_woningen": 4000,
    "perc_groei_trans": 0.212
},
{
    "GM_NAAM": "Utrecht",
    "GM_CODE": "GM0344",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 760,
    "behoefte_woningen": 26000,
    "perc_groei_trans": 0.029
},
{
    "GM_NAAM": "Arnhem",
    "GM_CODE": "GM0202",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 719,
    "behoefte_woningen": 6000,
    "perc_groei_trans": 0.12
},
{
    "GM_NAAM": "Hilversum",
    "GM_CODE": "GM0402",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 684,
    "behoefte_woningen": 2900,
    "perc_groei_trans": 0.236
},
{
    "GM_NAAM": "Gouda",
    "GM_CODE": "GM0513",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 592,
    "behoefte_woningen": 3300,
    "perc_groei_trans": 0.179
},
{
    "GM_NAAM": "Eindhoven",
    "GM_CODE": "GM0772",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 558,
    "behoefte_woningen": 6400,
    "perc_groei_trans": 0.087
},
{
    "GM_NAAM": "Groningen",
    "GM_CODE": "GM0014",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 450,
    "behoefte_woningen": 20500,
    "perc_groei_trans": 0.022
},
{
    "GM_NAAM": "Leiden",
    "GM_CODE": "GM0546",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 413,
    "behoefte_woningen": 5300,
    "perc_groei_trans": 0.078
},
{
    "GM_NAAM": "Dordrecht",
    "GM_CODE": "GM0505",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 389,
    "behoefte_woningen": 3000,
    "perc_groei_trans": 0.13
},
{
    "GM_NAAM": "Zoetermeer",
    "GM_CODE": "GM0637",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 383,
    "behoefte_woningen": 2500,
    "perc_groei_trans": 0.153
},
{
    "GM_NAAM": "Leeuwarden",
    "GM_CODE": "GM0080",
    "Provincie": "Friesland",
    "NVM": "YES",
    "kantoren_woningen": 347,
    "behoefte_woningen": 3500,
    "perc_groei_trans": 0.099
},
{
    "GM_NAAM": "Zwolle",
    "GM_CODE": "GM0193",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 328,
    "behoefte_woningen": 6600,
    "perc_groei_trans": 0.05
},
{
    "GM_NAAM": "Haarlem",
    "GM_CODE": "GM0392",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 323,
    "behoefte_woningen": 6700,
    "perc_groei_trans": 0.048
},
{
    "GM_NAAM": "Maastricht",
    "GM_CODE": "GM0935",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 322,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.268
},
{
    "GM_NAAM": "Amersfoort",
    "GM_CODE": "GM0307",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 315,
    "behoefte_woningen": 7100,
    "perc_groei_trans": 0.044
},
{
    "GM_NAAM": "Rijswijk",
    "GM_CODE": "GM0603",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 290,
    "behoefte_woningen": 6400,
    "perc_groei_trans": 0.045
},
{
    "GM_NAAM": "Heerlen",
    "GM_CODE": "GM0917",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 289,
    "behoefte_woningen": -200,
    "perc_groei_trans": -1.445
},
{
    "GM_NAAM": "Enschede",
    "GM_CODE": "GM0153",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 270,
    "behoefte_woningen": 3400,
    "perc_groei_trans": 0.079
},
{
    "GM_NAAM": "Leidschendam-Voorburg",
    "GM_CODE": "GM1916",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 230,
    "behoefte_woningen": 2700,
    "perc_groei_trans": 0.085
},
{
    "GM_NAAM": "Stichtse Vecht",
    "GM_CODE": "GM1904",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 228,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.19
},
{
    "GM_NAAM": "Roermond",
    "GM_CODE": "GM0957",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 227,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0.151
},
{
    "GM_NAAM": "Nieuwegein",
    "GM_CODE": "GM0356",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 226,
    "behoefte_woningen": 2200,
    "perc_groei_trans": 0.103
},
{
    "GM_NAAM": "Helmond",
    "GM_CODE": "GM0794",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 216,
    "behoefte_woningen": 4200,
    "perc_groei_trans": 0.051
},
{
    "GM_NAAM": "'s Hertogenbosch",
    "GM_CODE": "GM0796",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 213,
    "behoefte_woningen": 5700,
    "perc_groei_trans": 0.037
},
{
    "GM_NAAM": "Breda",
    "GM_CODE": "GM0758",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 212,
    "behoefte_woningen": 7100,
    "perc_groei_trans": 0.03
},
{
    "GM_NAAM": "Zaanstad",
    "GM_CODE": "GM0479",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 172,
    "behoefte_woningen": 6800,
    "perc_groei_trans": 0.025
},
{
    "GM_NAAM": "Veenendaal",
    "GM_CODE": "GM0345",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 161,
    "behoefte_woningen": 2600,
    "perc_groei_trans": 0.062
},
{
    "GM_NAAM": "Almelo",
    "GM_CODE": "GM0141",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 153,
    "behoefte_woningen": 2500,
    "perc_groei_trans": 0.061
},
{
    "GM_NAAM": "Schiedam",
    "GM_CODE": "GM0606",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 141,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0.083
},
{
    "GM_NAAM": "Hengelo",
    "GM_CODE": "GM0164",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 130,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0.076
},
{
    "GM_NAAM": "Nijmegen",
    "GM_CODE": "GM0268",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 129,
    "behoefte_woningen": 8500,
    "perc_groei_trans": 0.015
},
{
    "GM_NAAM": "Zeist",
    "GM_CODE": "GM0355",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 119,
    "behoefte_woningen": 3800,
    "perc_groei_trans": 0.031
},
{
    "GM_NAAM": "Assen",
    "GM_CODE": "GM0106",
    "Provincie": "Drenthe",
    "NVM": "YES",
    "kantoren_woningen": 114,
    "behoefte_woningen": 2500,
    "perc_groei_trans": 0.046
},
{
    "GM_NAAM": "Bunnik",
    "GM_CODE": "GM0312",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 112,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.093
},
{
    "GM_NAAM": "Oss",
    "GM_CODE": "GM0828",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 109,
    "behoefte_woningen": 3100,
    "perc_groei_trans": 0.035
},
{
    "GM_NAAM": "Huizen",
    "GM_CODE": "GM0406",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 107,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.089
},
{
    "GM_NAAM": "Gilze En Rijen",
    "GM_CODE": "GM0784",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 107,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.107
},
{
    "GM_NAAM": "Leiderdorp",
    "GM_CODE": "GM0547",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 103,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.129
},
{
    "GM_NAAM": "Spijkenisse",
    "GM_CODE": "GM0612",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 101,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.112
},
{
    "GM_NAAM": "Delft",
    "GM_CODE": "GM0503",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 99,
    "behoefte_woningen": 6900,
    "perc_groei_trans": 0.014
},
{
    "GM_NAAM": "Roosendaal",
    "GM_CODE": "GM1674",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 99,
    "behoefte_woningen": 2300,
    "perc_groei_trans": 0.043
},
{
    "GM_NAAM": "Venlo",
    "GM_CODE": "GM0983",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 97,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.108
},
{
    "GM_NAAM": "Rheden",
    "GM_CODE": "GM0275",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 97,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.121
},
{
    "GM_NAAM": "Meppel",
    "GM_CODE": "GM0119",
    "Provincie": "Drenthe",
    "NVM": "YES",
    "kantoren_woningen": 94,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.078
},
{
    "GM_NAAM": "Zwijndrecht",
    "GM_CODE": "GM0642",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 91,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.13
},
{
    "GM_NAAM": "Alkmaar",
    "GM_CODE": "GM0361",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 87,
    "behoefte_woningen": 3500,
    "perc_groei_trans": 0.025
},
{
    "GM_NAAM": "Middelburg",
    "GM_CODE": "GM0687",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 87,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.087
},
{
    "GM_NAAM": "Diemen",
    "GM_CODE": "GM0384",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 83,
    "behoefte_woningen": 2700,
    "perc_groei_trans": 0.031
},
{
    "GM_NAAM": "Tilburg",
    "GM_CODE": "GM0855",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 82,
    "behoefte_woningen": 9700,
    "perc_groei_trans": 0.008
},
{
    "GM_NAAM": "Alphen Aan Den Rijn",
    "GM_CODE": "GM0484",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 82,
    "behoefte_woningen": 1400,
    "perc_groei_trans": 0.059
},
{
    "GM_NAAM": "Almere",
    "GM_CODE": "GM0034",
    "Provincie": "Flevoland",
    "NVM": "YES",
    "kantoren_woningen": 82,
    "behoefte_woningen": 19200,
    "perc_groei_trans": 0.004
},
{
    "GM_NAAM": "Heerenveen",
    "GM_CODE": "GM0074",
    "Provincie": "Friesland",
    "NVM": "YES",
    "kantoren_woningen": 81,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.101
},
{
    "GM_NAAM": "Zutphen",
    "GM_CODE": "GM0301",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 76,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.076
},
{
    "GM_NAAM": "Kaag En Braassem",
    "GM_CODE": "GM1884",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 73,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.066
},
{
    "GM_NAAM": "Leusden",
    "GM_CODE": "GM0327",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 73,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.091
},
{
    "GM_NAAM": "Ede",
    "GM_CODE": "GM0228",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 72,
    "behoefte_woningen": 4800,
    "perc_groei_trans": 0.015
},
{
    "GM_NAAM": "Lelystad",
    "GM_CODE": "GM0995",
    "Provincie": "Flevoland",
    "NVM": "YES",
    "kantoren_woningen": 71,
    "behoefte_woningen": 4200,
    "perc_groei_trans": 0.017
},
{
    "GM_NAAM": "Winterswijk",
    "GM_CODE": "GM0294",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 71,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0.142
},
{
    "GM_NAAM": "Bergen Op Zoom",
    "GM_CODE": "GM0748",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 70,
    "behoefte_woningen": 2900,
    "perc_groei_trans": 0.024
},
{
    "GM_NAAM": "Doetinchem",
    "GM_CODE": "GM0222",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 67,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.074
},
{
    "GM_NAAM": "Hoorn",
    "GM_CODE": "GM0405",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 67,
    "behoefte_woningen": 2600,
    "perc_groei_trans": 0.026
},
{
    "GM_NAAM": "Uithoorn",
    "GM_CODE": "GM0451",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 62,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.056
},
{
    "GM_NAAM": "Hoogeveen",
    "GM_CODE": "GM0118",
    "Provincie": "Drenthe",
    "NVM": "YES",
    "kantoren_woningen": 58,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.058
},
{
    "GM_NAAM": "Capelle Aan Den Ijssel",
    "GM_CODE": "GM0502",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 56,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.07
},
{
    "GM_NAAM": "Weesp",
    "GM_CODE": "GM0457",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 54,
    "behoefte_woningen": 1900,
    "perc_groei_trans": 0.028
},
{
    "GM_NAAM": "Etten-Leur",
    "GM_CODE": "GM0777",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 53,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0.035
},
{
    "GM_NAAM": "Emmen",
    "GM_CODE": "GM0114",
    "Provincie": "Drenthe",
    "NVM": "YES",
    "kantoren_woningen": 53,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0.031
},
{
    "GM_NAAM": "Heemstede",
    "GM_CODE": "GM0397",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 51,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.064
},
{
    "GM_NAAM": "Oldenzaal",
    "GM_CODE": "GM0173",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 50,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.045
},
{
    "GM_NAAM": "Deventer",
    "GM_CODE": "GM0150",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 49,
    "behoefte_woningen": 3300,
    "perc_groei_trans": 0.015
},
{
    "GM_NAAM": "Weert",
    "GM_CODE": "GM0988",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 49,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.049
},
{
    "GM_NAAM": "Beverwijk",
    "GM_CODE": "GM0375",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 47,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0.029
},
{
    "GM_NAAM": "Waddinxveen",
    "GM_CODE": "GM0627",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 46,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.038
},
{
    "GM_NAAM": "Tiel",
    "GM_CODE": "GM0281",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 45,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.023
},
{
    "GM_NAAM": "Waalwijk",
    "GM_CODE": "GM0867",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 45,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.023
},
{
    "GM_NAAM": "Ridderkerk",
    "GM_CODE": "GM0597",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 44,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.044
},
{
    "GM_NAAM": "Venray",
    "GM_CODE": "GM0984",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 41,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.046
},
{
    "GM_NAAM": "Heerhugowaard",
    "GM_CODE": "GM0398",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 39,
    "behoefte_woningen": 2500,
    "perc_groei_trans": 0.016
},
{
    "GM_NAAM": "Zuidplas",
    "GM_CODE": "GM1892",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 37,
    "behoefte_woningen": 2400,
    "perc_groei_trans": 0.015
},
{
    "GM_NAAM": "Hoogezand-Sappemeer",
    "GM_CODE": "GM0018",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 36,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0.12
},
{
    "GM_NAAM": "Lochem",
    "GM_CODE": "GM0262",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 36,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.045
},
{
    "GM_NAAM": "Uden",
    "GM_CODE": "GM0856",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 35,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.018
},
{
    "GM_NAAM": "Nijkerk",
    "GM_CODE": "GM0267",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 32,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0.019
},
{
    "GM_NAAM": "Naarden",
    "GM_CODE": "GM0425",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 31,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.052
},
{
    "GM_NAAM": "Lisse",
    "GM_CODE": "GM0553",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 30,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.038
},
{
    "GM_NAAM": "Soest",
    "GM_CODE": "GM0342",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 29,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0.019
},
{
    "GM_NAAM": "Oud-Beijerland",
    "GM_CODE": "GM0584",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 29,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0.073
},
{
    "GM_NAAM": "Velsen",
    "GM_CODE": "GM0453",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 29,
    "behoefte_woningen": 1800,
    "perc_groei_trans": 0.016
},
{
    "GM_NAAM": "Sittard-Geleen",
    "GM_CODE": "GM1883",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 27,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0.054
},
{
    "GM_NAAM": "Den Helder",
    "GM_CODE": "GM0400",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 26,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0.087
},
{
    "GM_NAAM": "Haren",
    "GM_CODE": "GM0017",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 26,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0.087
},
{
    "GM_NAAM": "Purmerend",
    "GM_CODE": "GM0439",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 26,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.013
},
{
    "GM_NAAM": "Bodegraven-Reeuwijk",
    "GM_CODE": "GM1901",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 26,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0.052
},
{
    "GM_NAAM": "Smallingerland",
    "GM_CODE": "GM0090",
    "Provincie": "Friesland",
    "NVM": "YES",
    "kantoren_woningen": 25,
    "behoefte_woningen": 1300,
    "perc_groei_trans": 0.019
},
{
    "GM_NAAM": "Woudenberg",
    "GM_CODE": "GM0351",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 22,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.024
},
{
    "GM_NAAM": "Kerkrade",
    "GM_CODE": "GM0928",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 22,
    "behoefte_woningen": -300,
    "perc_groei_trans": -0.073
},
{
    "GM_NAAM": "Delfzijl",
    "GM_CODE": "GM0010",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 22,
    "behoefte_woningen": -1200,
    "perc_groei_trans": -0.018
},
{
    "GM_NAAM": "Houten",
    "GM_CODE": "GM0321",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 20,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.01
},
{
    "GM_NAAM": "Sluis",
    "GM_CODE": "GM1714",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 20,
    "behoefte_woningen": -1100,
    "perc_groei_trans": -0.018
},
{
    "GM_NAAM": "Utrechtse Heuvelrug",
    "GM_CODE": "GM1581",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 20,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0.025
},
{
    "GM_NAAM": "Nieuwkoop",
    "GM_CODE": "GM0569",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 20,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.033
},
{
    "GM_NAAM": "Overbetuwe",
    "GM_CODE": "GM1734",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 19,
    "behoefte_woningen": 2000,
    "perc_groei_trans": 0.01
},
{
    "GM_NAAM": "Harderwijk",
    "GM_CODE": "GM0243",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 18,
    "behoefte_woningen": 2100,
    "perc_groei_trans": 0.009
},
{
    "GM_NAAM": "Vught",
    "GM_CODE": "GM0865",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 18,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.03
},
{
    "GM_NAAM": "Roerdalen",
    "GM_CODE": "GM1669",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 18,
    "behoefte_woningen": -100,
    "perc_groei_trans": -0.18
},
{
    "GM_NAAM": "Beek",
    "GM_CODE": "GM0888",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 17,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0.17
},
{
    "GM_NAAM": "Hulst",
    "GM_CODE": "GM0677",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 17,
    "behoefte_woningen": -300,
    "perc_groei_trans": -0.057
},
{
    "GM_NAAM": "Rijssen-Holten",
    "GM_CODE": "GM1742",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 16,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.023
},
{
    "GM_NAAM": "Renkum",
    "GM_CODE": "GM0274",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 16,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.027
},
{
    "GM_NAAM": "Noordwijk",
    "GM_CODE": "GM0575",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 16,
    "behoefte_woningen": 1300,
    "perc_groei_trans": 0.012
},
{
    "GM_NAAM": "Hollands Kroon",
    "GM_CODE": "GM1911",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 15,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.014
},
{
    "GM_NAAM": "Waalre",
    "GM_CODE": "GM0866",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 15,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0.038
},
{
    "GM_NAAM": "Katwijk",
    "GM_CODE": "GM0537",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 14,
    "behoefte_woningen": 4600,
    "perc_groei_trans": 0.003
},
{
    "GM_NAAM": "Dronten",
    "GM_CODE": "GM0303",
    "Provincie": "Flevoland",
    "NVM": "YES",
    "kantoren_woningen": 14,
    "behoefte_woningen": 2900,
    "perc_groei_trans": 0.005
},
{
    "GM_NAAM": "Peel En Maas",
    "GM_CODE": "GM1894",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 14,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.016
},
{
    "GM_NAAM": "Aalsmeer",
    "GM_CODE": "GM0358",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 13,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0.008
},
{
    "GM_NAAM": "Zevenaar",
    "GM_CODE": "GM0299",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 13,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.019
},
{
    "GM_NAAM": "Schouwen-Duiveland",
    "GM_CODE": "GM1676",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 12,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0.024
},
{
    "GM_NAAM": "Culemborg",
    "GM_CODE": "GM0216",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 12,
    "behoefte_woningen": 1800,
    "perc_groei_trans": 0.007
},
{
    "GM_NAAM": "Bussum",
    "GM_CODE": "GM0381",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 12,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.011
},
{
    "GM_NAAM": "Hardinxveld-Giessendam",
    "GM_CODE": "GM0523",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 12,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0.024
},
{
    "GM_NAAM": "Veldhoven",
    "GM_CODE": "GM0861",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 11,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0.007
},
{
    "GM_NAAM": "Alblasserdam",
    "GM_CODE": "GM0482",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 11,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.018
},
{
    "GM_NAAM": "Pijnacker-Nootdorp",
    "GM_CODE": "GM1926",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 11,
    "behoefte_woningen": 5000,
    "perc_groei_trans": 0.002
},
{
    "GM_NAAM": "Baarn",
    "GM_CODE": "GM0308",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 10,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.014
},
{
    "GM_NAAM": "Oost Gelre",
    "GM_CODE": "GM1586",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 10,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0.025
},
{
    "GM_NAAM": "Gorinchem",
    "GM_CODE": "GM0512",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 9,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.013
},
{
    "GM_NAAM": "Sudwest-Fryslan",
    "GM_CODE": "GM1900",
    "Provincie": "Friesland",
    "NVM": "YES",
    "kantoren_woningen": 8,
    "behoefte_woningen": 2400,
    "perc_groei_trans": 0.003
},
{
    "GM_NAAM": "Albrandswaard",
    "GM_CODE": "GM0613",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 8,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.008
},
{
    "GM_NAAM": "De Bilt",
    "GM_CODE": "GM0310",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 8,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.011
},
{
    "GM_NAAM": "Hardenberg",
    "GM_CODE": "GM0160",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 8,
    "behoefte_woningen": 1900,
    "perc_groei_trans": 0.004
},
{
    "GM_NAAM": "Edam-Volendam",
    "GM_CODE": "GM0385",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 7,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.006
},
{
    "GM_NAAM": "Krimpen Aan Den Ijssel",
    "GM_CODE": "GM0542",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.007
},
{
    "GM_NAAM": "Brielle",
    "GM_CODE": "GM0501",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.009
},
{
    "GM_NAAM": "Hof Van Twente",
    "GM_CODE": "GM1735",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.009
},
{
    "GM_NAAM": "Noordoostpolder",
    "GM_CODE": "GM0171",
    "Provincie": "Flevoland",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.006
},
{
    "GM_NAAM": "Gennep",
    "GM_CODE": "GM0907",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0.06
},
{
    "GM_NAAM": "Duiven",
    "GM_CODE": "GM0226",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0.01
},
{
    "GM_NAAM": "Borne",
    "GM_CODE": "GM0147",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 6,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0.005
},
{
    "GM_NAAM": "Barneveld",
    "GM_CODE": "GM0203",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 5,
    "behoefte_woningen": 2900,
    "perc_groei_trans": 0.002
},
{
    "GM_NAAM": "Sliedrecht",
    "GM_CODE": "GM0610",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 5,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0.006
},
{
    "GM_NAAM": "Steenwijkerland",
    "GM_CODE": "GM1708",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 5,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0.004
},
{
    "GM_NAAM": "Oldambt",
    "GM_CODE": "GM1895",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 4,
    "behoefte_woningen": -100,
    "perc_groei_trans": -0.04
},
{
    "GM_NAAM": "Beuningen",
    "GM_CODE": "GM0209",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 4,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0.006
},
{
    "GM_NAAM": "Boxtel",
    "GM_CODE": "GM0757",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 4,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0.004
},
{
    "GM_NAAM": "Meerssen",
    "GM_CODE": "GM0938",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 4,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Aa En Hunze",
    "GM_CODE": "GM1680",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Aalburg",
    "GM_CODE": "GM0738",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Aalten",
    "GM_CODE": "GM0197",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Achtkarspelen",
    "GM_CODE": "GM0059",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Alphen-Chaam",
    "GM_CODE": "GM1723",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ameland",
    "GM_CODE": "GM0060",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Appingedam",
    "GM_CODE": "GM0003",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Asten",
    "GM_CODE": "GM0743",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Baarle-Nassau",
    "GM_CODE": "GM0744",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Barendrecht",
    "GM_CODE": "GM0489",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bedum",
    "GM_CODE": "GM0005",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Beemster",
    "GM_CODE": "GM0370",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Beesel",
    "GM_CODE": "GM0889",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bellingwedde",
    "GM_CODE": "GM0007",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bergambacht",
    "GM_CODE": "GM0491",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bergeijk",
    "GM_CODE": "GM1724",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bergen Lb",
    "GM_CODE": "GM0893",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bergen Nh",
    "GM_CODE": "GM0373",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Berkelland",
    "GM_CODE": "GM1859",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bernheze",
    "GM_CODE": "GM1721",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bernisse",
    "GM_CODE": "GM0568",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Best",
    "GM_CODE": "GM0753",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Binnenmaas",
    "GM_CODE": "GM0585",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bladel",
    "GM_CODE": "GM1728",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Blaricum",
    "GM_CODE": "GM0376",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bloemendaal",
    "GM_CODE": "GM0377",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Boekel",
    "GM_CODE": "GM0755",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Borger-Odoorn",
    "GM_CODE": "GM1681",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Borsele",
    "GM_CODE": "GM0654",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Boxmeer",
    "GM_CODE": "GM0756",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bronckhorst",
    "GM_CODE": "GM1876",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Brummen",
    "GM_CODE": "GM0213",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Brunssum",
    "GM_CODE": "GM0899",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Bunschoten",
    "GM_CODE": "GM0313",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Buren",
    "GM_CODE": "GM0214",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Castricum",
    "GM_CODE": "GM0383",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Coevorden",
    "GM_CODE": "GM0109",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Cranendonck",
    "GM_CODE": "GM1706",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Cromstrijen",
    "GM_CODE": "GM0611",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Cuijk",
    "GM_CODE": "GM1684",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Dalfsen",
    "GM_CODE": "GM0148",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Dantumadiel",
    "GM_CODE": "GM1891",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "De Friese Meren",
    "GM_CODE": "GM1921",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "De Marne",
    "GM_CODE": "GM1663",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "De Ronde Venen",
    "GM_CODE": "GM0736",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "De Wolden",
    "GM_CODE": "GM1690",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Deurne",
    "GM_CODE": "GM0762",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Dinkelland",
    "GM_CODE": "GM1774",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Doesburg",
    "GM_CODE": "GM0221",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Dongen",
    "GM_CODE": "GM0766",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Dongeradeel",
    "GM_CODE": "GM0058",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Drechterland",
    "GM_CODE": "GM0498",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Drimmelen",
    "GM_CODE": "GM1719",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Druten",
    "GM_CODE": "GM0225",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Echt-Susteren",
    "GM_CODE": "GM1711",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Eemnes",
    "GM_CODE": "GM0317",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Eemsmond",
    "GM_CODE": "GM1651",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Eersel",
    "GM_CODE": "GM0770",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Eijsden-Margraten",
    "GM_CODE": "GM1903",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Elburg",
    "GM_CODE": "GM0230",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Enkhuizen",
    "GM_CODE": "GM0388",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Epe",
    "GM_CODE": "GM0232",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ermelo",
    "GM_CODE": "GM0233",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ferwerderadiel",
    "GM_CODE": "GM1722",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Franekeradeel",
    "GM_CODE": "GM0070",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Geertruidenberg",
    "GM_CODE": "GM0779",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Geldermalsen",
    "GM_CODE": "GM0236",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Geldrop-Mierlo",
    "GM_CODE": "GM1771",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Gemert-Bakel",
    "GM_CODE": "GM1652",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Giessenlanden",
    "GM_CODE": "GM0689",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Goeree-Overflakkee",
    "GM_CODE": "GM1924",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Goes",
    "GM_CODE": "GM0664",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Goirle",
    "GM_CODE": "GM0785",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Graft-De Rijp",
    "GM_CODE": "GM0365",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Grave",
    "GM_CODE": "GM0786",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Groesbeek",
    "GM_CODE": "GM0241",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Grootegast",
    "GM_CODE": "GM0015",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Gulpen-Wittem",
    "GM_CODE": "GM1729",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Haaksbergen",
    "GM_CODE": "GM0158",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Haaren",
    "GM_CODE": "GM0788",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Haarlemmerliede En Spaarnwoude",
    "GM_CODE": "GM0393",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Halderberge",
    "GM_CODE": "GM1655",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Harlingen",
    "GM_CODE": "GM0072",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hattem",
    "GM_CODE": "GM0244",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heemskerk",
    "GM_CODE": "GM0396",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heerde",
    "GM_CODE": "GM0246",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heeze-Leende",
    "GM_CODE": "GM1658",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heiloo",
    "GM_CODE": "GM0399",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hellendoorn",
    "GM_CODE": "GM0163",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hellevoetsluis",
    "GM_CODE": "GM0530",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hendrik-Ido-Ambacht",
    "GM_CODE": "GM0531",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Het Bildt",
    "GM_CODE": "GM0063",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heumen",
    "GM_CODE": "GM0252",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Heusden",
    "GM_CODE": "GM0797",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 2100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hillegom",
    "GM_CODE": "GM0534",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Hilvarenbeek",
    "GM_CODE": "GM0798",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Horst Aan De Maas",
    "GM_CODE": "GM1507",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ijsselstein",
    "GM_CODE": "GM0353",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Kampen",
    "GM_CODE": "GM0166",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Kapelle",
    "GM_CODE": "GM0678",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Koggenland",
    "GM_CODE": "GM1598",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Kollumerland En Nieuwkruisland",
    "GM_CODE": "GM0079",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Korendijk",
    "GM_CODE": "GM0588",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Laarbeek",
    "GM_CODE": "GM1659",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Landerd",
    "GM_CODE": "GM1685",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Landgraaf",
    "GM_CODE": "GM0882",
    "Provincie": "Limburg",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": -200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Landsmeer",
    "GM_CODE": "GM0415",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Langedijk",
    "GM_CODE": "GM0416",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Lansingerland",
    "GM_CODE": "GM1621",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 5200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Laren",
    "GM_CODE": "GM0417",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Leek",
    "GM_CODE": "GM0022",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Leerdam",
    "GM_CODE": "GM0545",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Leeuwarderadeel",
    "GM_CODE": "GM0081",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Leudal",
    "GM_CODE": "GM1640",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Lingewaal",
    "GM_CODE": "GM0733",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Lingewaard",
    "GM_CODE": "GM1705",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 2100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Littenseradiel",
    "GM_CODE": "GM0140",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Loon Op Zand",
    "GM_CODE": "GM0809",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Lopik",
    "GM_CODE": "GM0331",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Loppersum",
    "GM_CODE": "GM0024",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Losser",
    "GM_CODE": "GM0168",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Maasdonk",
    "GM_CODE": "GM1671",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Maasdriel",
    "GM_CODE": "GM0263",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Maasgouw",
    "GM_CODE": "GM1641",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Maassluis",
    "GM_CODE": "GM0556",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Marum",
    "GM_CODE": "GM0025",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Medemblik",
    "GM_CODE": "GM0420",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Menameradiel",
    "GM_CODE": "GM1908",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Menterwolde",
    "GM_CODE": "GM1987",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Midden-Delfland",
    "GM_CODE": "GM1842",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Midden-Drenthe",
    "GM_CODE": "GM1731",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Mill En Sint Hubert",
    "GM_CODE": "GM0815",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Millingen Aan De Rijn",
    "GM_CODE": "GM0265",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Moerdijk",
    "GM_CODE": "GM1709",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Molenwaard",
    "GM_CODE": "GM1927",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Montferland",
    "GM_CODE": "GM1955",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Montfoort",
    "GM_CODE": "GM0335",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Mook En Middelaar",
    "GM_CODE": "GM0944",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Muiden",
    "GM_CODE": "GM0424",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Neder-Betuwe",
    "GM_CODE": "GM1740",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Nederlek",
    "GM_CODE": "GM0643",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Nederweert",
    "GM_CODE": "GM0946",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Neerijnen",
    "GM_CODE": "GM0304",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Noord-Beveland",
    "GM_CODE": "GM1695",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Noordenveld",
    "GM_CODE": "GM1699",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Noordwijkerhout",
    "GM_CODE": "GM0576",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Nuenen Ca",
    "GM_CODE": "GM0820",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Nunspeet",
    "GM_CODE": "GM0302",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Nuth",
    "GM_CODE": "GM0951",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oegstgeest",
    "GM_CODE": "GM0579",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oirschot",
    "GM_CODE": "GM0823",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oisterwijk",
    "GM_CODE": "GM0824",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oldebroek",
    "GM_CODE": "GM0269",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Olst-Wijhe",
    "GM_CODE": "GM1773",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ommen",
    "GM_CODE": "GM0175",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Onderbanken",
    "GM_CODE": "GM0881",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oosterhout",
    "GM_CODE": "GM0826",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ooststellingwerf",
    "GM_CODE": "GM0085",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oostzaan",
    "GM_CODE": "GM0431",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Opmeer",
    "GM_CODE": "GM0432",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Opsterland",
    "GM_CODE": "GM0086",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oude Ijsselstreek",
    "GM_CODE": "GM1509",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ouder-Amstel",
    "GM_CODE": "GM0437",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ouderkerk",
    "GM_CODE": "GM0644",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Oudewater",
    "GM_CODE": "GM0589",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Papendrecht",
    "GM_CODE": "GM0590",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Pekela",
    "GM_CODE": "GM0765",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Putten",
    "GM_CODE": "GM0273",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Raalte",
    "GM_CODE": "GM0177",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Reimerswaal",
    "GM_CODE": "GM0703",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Renswoude",
    "GM_CODE": "GM0339",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Reusel-De Mierden",
    "GM_CODE": "GM1667",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Rhenen",
    "GM_CODE": "GM0340",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Rijnwaarden",
    "GM_CODE": "GM0196",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Rozendaal",
    "GM_CODE": "GM0277",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Rucphen",
    "GM_CODE": "GM0840",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schagen",
    "GM_CODE": "GM0441",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schermer",
    "GM_CODE": "GM0458",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Scherpenzeel",
    "GM_CODE": "GM0279",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schiermonnikoog",
    "GM_CODE": "GM0088",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schijndel",
    "GM_CODE": "GM0844",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schinnen",
    "GM_CODE": "GM0962",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Schoonhoven",
    "GM_CODE": "GM0608",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Simpelveld",
    "GM_CODE": "GM0965",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Sint Anthonis",
    "GM_CODE": "GM1702",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Sint-Michielsgestel",
    "GM_CODE": "GM0845",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Sint-Oedenrode",
    "GM_CODE": "GM0846",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Slochteren",
    "GM_CODE": "GM0040",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Someren",
    "GM_CODE": "GM0847",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Son En Breugel",
    "GM_CODE": "GM0848",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Stadskanaal",
    "GM_CODE": "GM0037",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Staphorst",
    "GM_CODE": "GM0180",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Stede Broec",
    "GM_CODE": "GM0532",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Steenbergen",
    "GM_CODE": "GM0851",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Stein",
    "GM_CODE": "GM0971",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Strijen",
    "GM_CODE": "GM0617",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ten Boer",
    "GM_CODE": "GM0009",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Terneuzen",
    "GM_CODE": "GM0715",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Terschelling",
    "GM_CODE": "GM0093",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Texel",
    "GM_CODE": "GM0448",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Teylingen",
    "GM_CODE": "GM1525",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Tholen",
    "GM_CODE": "GM0716",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Tubbergen",
    "GM_CODE": "GM0183",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Twenterand",
    "GM_CODE": "GM1700",
    "Provincie": "Overijssel",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Tynaarlo",
    "GM_CODE": "GM1730",
    "Provincie": "Drenthe",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 800,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Tytsjerksteradiel",
    "GM_CODE": "GM0737",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Ubbergen",
    "GM_CODE": "GM0282",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Uitgeest",
    "GM_CODE": "GM0450",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Urk",
    "GM_CODE": "GM0184",
    "Provincie": "Flevoland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vaals",
    "GM_CODE": "GM0981",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Valkenburg Aan De Geul",
    "GM_CODE": "GM0994",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Valkenswaard",
    "GM_CODE": "GM0858",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Veendam",
    "GM_CODE": "GM0047",
    "Provincie": "Groningen",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Veere",
    "GM_CODE": "GM0717",
    "Provincie": "Zeeland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Veghel",
    "GM_CODE": "GM0860",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vianen",
    "GM_CODE": "GM0620",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vlaardingen",
    "GM_CODE": "GM0622",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vlagtwedde",
    "GM_CODE": "GM0048",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": -100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vlieland",
    "GM_CODE": "GM0096",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vlissingen",
    "GM_CODE": "GM0718",
    "Provincie": "Zeeland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Vlist",
    "GM_CODE": "GM0623",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Voerendaal",
    "GM_CODE": "GM0986",
    "Provincie": "Limburg",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 0,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Voorschoten",
    "GM_CODE": "GM0626",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Voorst",
    "GM_CODE": "GM0285",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wageningen",
    "GM_CODE": "GM0289",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wassenaar",
    "GM_CODE": "GM0629",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Waterland",
    "GM_CODE": "GM0852",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Werkendam",
    "GM_CODE": "GM0870",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "West Maas En Waal",
    "GM_CODE": "GM0668",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Westerveld",
    "GM_CODE": "GM1701",
    "Provincie": "Drenthe",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Westervoort",
    "GM_CODE": "GM0293",
    "Provincie": "Gelderland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Westland",
    "GM_CODE": "GM1783",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 5600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Weststellingwerf",
    "GM_CODE": "GM0098",
    "Provincie": "Friesland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Westvoorne",
    "GM_CODE": "GM0614",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 100,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wierden",
    "GM_CODE": "GM0189",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wijchen",
    "GM_CODE": "GM0296",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1000,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wijdemeren",
    "GM_CODE": "GM1696",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wijk Bij Duurstede",
    "GM_CODE": "GM0352",
    "Provincie": "Utrecht",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Winsum",
    "GM_CODE": "GM0053",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Woensdrecht",
    "GM_CODE": "GM0873",
    "Provincie": "Noord-Brabant",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Woerden",
    "GM_CODE": "GM0632",
    "Provincie": "Utrecht",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1700,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Wormerland",
    "GM_CODE": "GM0880",
    "Provincie": "Noord-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Woudrichem",
    "GM_CODE": "GM0874",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zaltbommel",
    "GM_CODE": "GM0297",
    "Provincie": "Gelderland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 900,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zandvoort",
    "GM_CODE": "GM0473",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zederik",
    "GM_CODE": "GM0707",
    "Provincie": "Zuid-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zeevang",
    "GM_CODE": "GM0478",
    "Provincie": "Noord-Holland",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 200,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zeewolde",
    "GM_CODE": "GM0050",
    "Provincie": "Flevoland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 1400,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zoeterwoude",
    "GM_CODE": "GM0638",
    "Provincie": "Zuid-Holland",
    "NVM": "YES",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zuidhorn",
    "GM_CODE": "GM0056",
    "Provincie": "Groningen",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 500,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zundert",
    "GM_CODE": "GM0879",
    "Provincie": "Noord-Brabant",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 600,
    "perc_groei_trans": 0
},
{
    "GM_NAAM": "Zwartewaterland",
    "GM_CODE": "GM1896",
    "Provincie": "Overijssel",
    "NVM": "NO",
    "kantoren_woningen": 0,
    "behoefte_woningen": 300,
    "perc_groei_trans": 0
}
];


/* =============================================================
 * bootstrap-combobox.js v1.1.6
 * =============================================================
 * Copyright 2012 Daniel Farrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function( $ ) {

 "use strict";

 /* COMBOBOX PUBLIC CLASS DEFINITION
  * ================================ */

  var Combobox = function ( element, options ) {
    this.options = $.extend({}, $.fn.combobox.defaults, options);
    this.$source = $(element);
    this.$container = this.setup();
    this.$element = this.$container.find('input[type=text]');
    this.$target = this.$container.find('input[type=hidden]');
    this.$button = this.$container.find('.dropdown-toggle');
    this.$menu = $(this.options.menu).appendTo('body');
    this.template = this.options.template || this.template
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.shown = false;
    this.selected = false;
    this.refresh();
    this.transferAttributes();
    this.listen();
  };

  Combobox.prototype = {

    constructor: Combobox

  , setup: function () {
      var combobox = $(this.template());
      this.$source.before(combobox);
      this.$source.hide();
      return combobox;
    }

  , disable: function() {
      this.$element.prop('disabled', true);
      this.$button.attr('disabled', true);
      this.disabled = true;
      this.$container.addClass('combobox-disabled');
    }

  , enable: function() {
      this.$element.prop('disabled', false);
      this.$button.attr('disabled', false);
      this.disabled = false;
      this.$container.removeClass('combobox-disabled');
    }
  , parse: function () {
      var that = this
        , map = {}
        , source = []
        , selected = false
        , selectedValue = '';
      this.$source.find('option').each(function() {
        var option = $(this);
        if (option.val() === '') {
          that.options.placeholder = option.text();
          return;
        }
        map[option.text()] = option.val();
        source.push(option.text());
        if (option.prop('selected')) {
          selected = option.text();
          selectedValue = option.val();
        }
      })
      this.map = map;
      if (selected) {
        this.$element.val(selected);
        this.$target.val(selectedValue);
        this.$container.addClass('combobox-selected');
        this.selected = true;
      }
      return source;
    }

  , transferAttributes: function() {
    this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
    this.$element.attr('placeholder', this.options.placeholder)
    this.$target.prop('name', this.$source.prop('name'))
    this.$target.val(this.$source.val())
    this.$source.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
    this.$element.attr('required', this.$source.attr('required'))
    this.$element.attr('rel', this.$source.attr('rel'))
    this.$element.attr('title', this.$source.attr('title'))
    this.$element.attr('class', this.$source.attr('class'))
    this.$element.attr('tabindex', this.$source.attr('tabindex'))
    this.$source.removeAttr('tabindex')
    if (this.$source.attr('disabled')!==undefined)
      this.disable();
  }

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value');
      this.$element.val(this.updater(val)).trigger('change');
      this.$target.val(this.map[val]).trigger('change');
      this.$source.val(this.map[val]).trigger('change');
      this.$container.addClass('combobox-selected');
      this.selected = true;
      return this.hide();
    }

  , updater: function (item) {
      return item;
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      });

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show();

      $('.dropdown-menu').on('mousedown', $.proxy(this.scrollSafety, this));

      this.shown = true;
      return this;
    }

  , hide: function () {
      this.$menu.hide();
      $('.dropdown-menu').off('mousedown', $.proxy(this.scrollSafety, this));
      this.$element.on('blur', $.proxy(this.blur, this));
      this.shown = false;
      return this;
    }

  , lookup: function (event) {
      this.query = this.$element.val();
      return this.process(this.source);
    }

  , process: function (items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      })

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      return this.render(items.slice(0, this.options.items)).show();
    }

  , template: function() {
      if (this.options.bsVersion == '2') {
        return '<div class="combobox-container"><input type="hidden" /> <div class="input-append"> <input type="text" autocomplete="off" /> <span class="add-on dropdown-toggle" data-dropdown="dropdown"> <span class="caret"/> <i class="icon-remove"/> </span> </div> </div>'
      } else {
        return '<div class="combobox-container"> <input type="hidden" /> <div class="input-group"> <input type="text" autocomplete="off" /> <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> <span class="caret" /> <span class="glyphicon glyphicon-remove" /> </span> </div> </div>'
      }
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item;

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {beginswith.push(item);}
        else if (~item.indexOf(this.query)) {caseSensitive.push(item);}
        else {caseInsensitive.push(item);}
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>';
      })
    }

  , render: function (items) {
      var that = this;

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item);
        i.find('a').html(that.highlighter(item));
        return i[0];
      })

      items.first().addClass('active');
      this.$menu.html(items);
      return this;
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    }

  , toggle: function () {
    if (!this.disabled) {
      if (this.$container.hasClass('combobox-selected')) {
        this.clearTarget();
        this.triggerChange();
        this.clearElement();
      } else {
        if (this.shown) {
          this.hide();
        } else {
          this.clearElement();
          this.lookup();
        }
      }
    }
  }

  , scrollSafety: function(e) {
      if (e.target.tagName == 'UL') {
          this.$element.off('blur');
      }
  }
  , clearElement: function () {
    this.$element.val('').focus();
  }

  , clearTarget: function () {
    this.$source.val('');
    this.$target.val('');
    this.$container.removeClass('combobox-selected');
    this.selected = false;
  }

  , triggerChange: function () {
    this.$source.trigger('change');
  }

  , refresh: function () {
    this.source = this.parse();
    this.options.items = this.source.length;
  }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));

      this.$button
        .on('click', $.proxy(this.toggle, this));
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    }

  , move: function (e) {
      if (!this.shown) {return;}

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          e.preventDefault();
          this.next();
          break;
      }

      e.stopPropagation();
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      this.move(e);
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) {return;}
      this.move(e);
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 39: // right arrow
        case 38: // up arrow
        case 37: // left arrow
        case 36: // home
        case 35: // end
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) {return;}
          this.select();
          break;

        case 27: // escape
          if (!this.shown) {return;}
          this.hide();
          break;

        default:
          this.clearTarget();
          this.lookup();
      }

      e.stopPropagation();
      e.preventDefault();
  }

  , focus: function (e) {
      this.focused = true;
    }

  , blur: function (e) {
      var that = this;
      this.focused = false;
      var val = this.$element.val();
      if (!this.selected && val !== '' ) {
        this.$element.val('');
        this.$source.val('').trigger('change');
        this.$target.val('').trigger('change');
      }
      if (!this.mousedover && this.shown) {setTimeout(function () { that.hide(); }, 200);}
    }

  , click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    }

  , mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    }

  , mouseleave: function (e) {
      this.mousedover = false;
    }
  };

  /* COMBOBOX PLUGIN DEFINITION
   * =========================== */
  $.fn.combobox = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('combobox')
        , options = typeof option == 'object' && option;
		
      $this.data('combobox', (data = new Combobox(this, options)));
      if (typeof option == 'string') {data[option]();}
    });
  };

  $.fn.combobox.defaults = {
    bsVersion: '3'
  , menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  };

  $.fn.combobox.Constructor = Combobox;

}( window.jQuery );

/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=d2f9f6900c2cc8e4c604)
 * Config saved to config.json and https://gist.github.com/d2f9f6900c2cc8e4c604
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.4
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.4'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.4
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.4'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
