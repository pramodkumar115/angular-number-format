angular.module("input-number", [])
    .directive("ngNumberFormat", function ($browser, $filter) {
        return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

                /*if (attrs.ngNumberFormat == undefined || scope[attrs.ngNumberFormat] == undefined) {
                    alert("Please provide the options for the formatter");
                }
                else {*/
                    var options = scope[attrs.ngNumberFormat];

                    var formatInput = function () {
                        if (element.val() != null && element.val() != '') {
                            var value = element.val().replace(/[^\d.?-]/g, '');
                            value = applyMaxRestrictions(value);
                            var filteredValue = $filter('numberFilter')(value);
                            /*if(options!=undefined && options.type != undefined && options.type == 'Amount'){
                                var code;
                                if(options.currencyCode == undefined || options.currencyCode == null){
                                    code = "USD";
                                }else{
                                    code = options.currencyCode;
                                }

                                var ccy = getCurrency(code);
                                console.log(ccy);
                                if(ccy != null){
                                    filteredValue = ccy + " " + filteredValue;
                                }
                            }*/
                            element.val(filteredValue);
                        }
                    }
                    var applyMaxRestrictions = function(value){
                        if(options == undefined || (options.maxIntegerDigits == undefined && options.maxFractionDigits == undefined)){
                            return value;
                        }
                        else{
                            var digitArr = value.split('\.');
                            var intPart = digitArr[0];
                            var maxLimit = options.maxIntegerDigits;
                            if(intPart.indexOf("-") != -1){
                                maxLimit = maxLimit + 1;
                            }
                            var decimalPart = undefined;
                            if(digitArr.length >= 2){
                                decimalPart = digitArr[1];
                            }
                            if(intPart.length > maxLimit){
                                intPart = intPart.substring(0, maxLimit);
                            }
                            if(decimalPart!= undefined && decimalPart.length > options.maxFractionDigits){
                                decimalPart = decimalPart.substring(0, options.maxFractionDigits);
                            }
                            if(decimalPart != undefined){
                                return intPart+"."+decimalPart;
                            }else{
                                return intPart;
                            }
                        }
                    }
                    ngModelCtrl.$parsers.push(function(viewValue) {
                        var returnable = viewValue.replace(/[^\d.?-]/g, '');
                        returnable = applyMaxRestrictions(removeUnwantedDotsAndMinus(returnable));
                        if(options.maxFractionDigits != undefined && options.maxFractionDigits == 0){
                            returnable = parseInt(returnable);
                        }else{
                            returnable = parseFloat(returnable);
                        }
                        return returnable;
                    });
                    element.bind("change", formatInput);
                    element.bind("keyup", function(event){
                        if(event.keyCode != 37 && event.keyCode != 39){
                            formatInput();
                        }
                    });
                    //element.bind("keypress", formatInput);
                    element.bind("copy paste", function () {
                        $browser.defer(formatInput);
                    });
                //}

            }
        }
    })
    .filter("numberFilter", function () {
        return function (number) {
            if(number != null){
                var val = removeUnwantedDotsAndMinus(number);

                var n = val.toString(), p = n.indexOf('.');
                return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
                    return p<0 || i<p ? ($0+',') : $0;
                });
            }

            //return filter(val);
        }

    });

function removeUnwantedDotsAndMinus(number){
    var value = number.replace(/[^\d.?-]/g, '');
    var val = '';
    var dotsAllowed = true;
    for(var i = 0; i < value.length; i++){
        if(value[i] == "-" && i > 0){
            // Do nothing
        }else{
            if(value[i] == "\."){
                if(dotsAllowed){
                    dotsAllowed = false;
                    val = val + value[i];
                }else{

                }
            }else{
                val = val + value[i];
            }

        }
    }
    return val;
}

function getCurrency(ccyCode){
    for(var i in ccyCodes){
        var ccyCodeItem = ccyCodes[i];
        if(ccyCodeItem[3] == ccyCode){
            if(ccyCodeItem[5].trim() != ''){
                return ccyCodeItem[5];
            }else{
                return ccyCodeItem[2];
            }

        }
    }
}

var ccyCodes = [
    ['Afghanistan','Afghan afghani','؋','AFN',' ','&#1547;','&#x60b;'],
    ['Albania','Albanian lek','L','ALL',' ',' ',' '],
    ['Algeria','Algerian dinar','د.ج','DZD',' ',' ',' '],
    ['Andorra','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Angola','Angolan kwanza','Kz','AOA',' ',' ',' '],
    ['Antigua and Barbuda','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['Argentina','Argentine peso','$','ARS',' ','&#36;','&#x0024;'],
    ['Armenia','Armenian dram','Armenian dram','AMD',' ',' ',' '],
    ['Aruba','Aruban florin','ƒ','AWG',' ',' ',' '],
    ['Australia','Australian dollar','A$','AUD',' ','&#36;','&#x0024;'],
    ['Austria','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Azerbaijan','Azerbaijani manat','ман','AZN',' ',' ',' '],
    ['Bahamas','Bahamian dollar','B$','BSD',' ','&#36;','&#x0024;'],
    ['Bahrain','Bahraini dinar','.د.ب','BHD',' ',' ',' '],
    ['Bangladesh','Bangladeshi taka','৳','BDT',' ','&#2547;','&#x9f3;'],
    ['Barbados','Barbadian dollar','Bds$','BBD',' ','&#36;','&#x0024;'],
    ['Belarus','Belarusian ruble','Br','BYR',' ',' ',' '],
    ['Belgium','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Belize','Belizean dollar','BZ$','BZD',' ',' ',' '],
    ['Benin','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Bermuda','Bermudian dollar','BD$','BMD',' ','&#36;','&#x0024;'],
    ['Bhutan','Bhutanese ngultrum','Nu.','BTN',' ',' ',' '],
    ['Bolivia','Bolivian boliviano','Bs.','BOB',' ',' ',' '],
    ['Bonaire','US dollar','US$','USD',' ','&#36;','&#x0024;'],
    ['Bosnia and Herzegovina','Bosnia and Herzegovina convertible mark','KM','BAM',' ',' ',' '],
    ['Botswana','Botswana pula','P','BWP',' ',' ',' '],
    ['Brazil','Brazilian real','R$','BRL',' ','&#36;','&#x0024;'],
    ['British Virgin Islands','US dollar','US$','USD',' ','&#36;','&#x0024;'],
    ['Brunei','Brunei dollar','B$','BND',' ','&#36;','&#x0024;'],
    ['Bulgaria','Bulgarian lev','лв','BGN',' ',' ',' '],
    ['Burkina Faso','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Burma','Burmese kyat','K','MMK',' ',' ',' '],
    ['Burundi','Burundian franc','FBu','BIF',' ',' ',' '],
    ['Cambodia','Cambodian riel','៛','KHR',' ','&#6107;','&#x17db;'],
    ['Cameroon','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Canada','Canadian dollar','C$','CAD',' ','&#36;','&#x0024;'],
    ['Cape Verde','Cape Verdean escudo','Esc','CVE',' ',' ',' '],
    ['Cayman Islands','Cayman Islands dollar','KY$','KYD',' ','&#36;','&#x0024;'],
    ['Central African Republic','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Chad','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Chile','Chilean peso','$','CLP',' ','&#36;','&#x0024;'],
    ['China, People’s Republic of','Chinese renminbi','¥','CNY','\&yen;','&#165;','&#x00a5;'],
    ['Cocos Islands','Australian dollar','A$','AUD',' ','&#36;','&#x0024;'],
    ['Colombia','Colombian peso','$','COP',' ','&#36;','&#x0024;'],
    ['Comoros','Comorian franc','CF','KMF',' ',' ',' '],
    ['Congo, Democratic Republic of','Congolese franc','FC','CDF',' ',' ',' '],
    ['Congo, Republic of the','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Cook Islands','New Zealand dollar','NZ$','NZD',' ','&#36;','&#x0024;'],
    ['Costa Rica','Costa Rican colón','₡','CRC',' ','&#8353;','&#x20a1;'],
    ['Côte d’Iviore','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Croatia','Croatian kuna','kn','HRK',' ',' ',' '],
    ['Cuba','Cuban peso','₱','CUC',' ','&#8369;','&#x20b1;'],
    ['Curaçao','Netherlands Antilles guilder','ƒ','ANG',' ',' ',' '],
    ['Cyprus','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Czech Republic','Czech koruna','Kč','CZK',' ',' ',' '],
    ['Denmark','Danish krone','kr','DKK',' ',' ',' '],
    ['Djibouti','Djiboutian franc','Fdj','DJF',' ',' ',' '],
    ['Dominica','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['Dominican Republic','Dominican peso','RD$','DOP',' ','&#36;','&#x0024;'],
    ['East Timor','US dollar','US$','USD',' ','&#36;','&#x0024;'],
    ['Ecuador','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Egypt','Egyptian pound','E£','EGP','\&pound;','&#163;','&#x00a3;'],
    ['El Salvador','Salvadoran colón','₡','SVC',' ','&#8353;','&#x20a1;'],
    ['Equatorial Guinea','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Eritrea','Eritrean nakfa','Nfa','ERN',' ',' ',' '],
    ['Estonia','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Ethiopia','Ethiopian birr','Br','ETB',' ',' ',' '],
    ['Falkland Islands','Falkland Islands pound','FK£','FKP','\&pound;','&#163;','&#x00a3;'],
    ['Fiji','Fijian dollar','FJ$','FJD',' ','&#36;','&#x0024;'],
    ['Finland','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['France','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['French Polynesia','CFP franc','F','XPF',' ',' ',' '],
    ['Gabon','Central African CFA franc','CFA','XAF',' ',' ',' '],
    ['Gambia','Gambian dalasi','D','GMD',' ',' ',' '],
    ['Georgia','Georgian lari','ლ','GEL',' ',' ',' '],
    ['Germany','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Ghana','Ghanian cedi','₵','GHS',' ','&#8373;','&#x20b5;'],
    ['Gibraltar','Gibraltar pound','£','GIP','\&pound;','&#163;','&#x00a3;'],
    ['Greece','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Grenada','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['Guatemala','Guatemalan quetzal','Q','GTQ',' ',' ',' '],
    ['Guernsey','British pound','£','GBP','\&pound;','&#163;','&#x00a3;'],
    ['Guinea','Guinean franc','FG','GNF',' ',' ',' '],
    ['Guinea-Bissau','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Guyana','Guyanese dollar','GY$','GYD',' ','&#36;','&#x0024;'],
    ['Haiti','Haitian gourde','G','HTG',' ',' ',' '],
    ['Honduras','Honduran lempira','L','HNL',' ',' ',' '],
    ['Hong Kong','Hong Kong dollar','HK$','HKD',' ','&#36;','&#x0024;'],
    ['Hungary','Hungarian forint','Ft','HUF',' ',' ',' '],
    ['Iceland','Icelandic króna','kr','ISK',' ',' ',' '],
    ['India','Indian rupee','Indian rupee','INR',' ','&#8377;','&#x20b9;'],
    ['Indonesia','Indonesian rupiah','Rp','IDR',' ',' ',' '],
    ['Iran','Iranian rial','﷼','IRR',' ','&#65020;','&#xfdfc;'],
    ['Iraq','Iraqi dinar','ع.د','IQD',' ',' ',' '],
    ['Ireland','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Isle of Man','British pound','£','GBP','\&pound;','&#163;','&#x00a3;'],
    ['Israel','Israeli new sheqel','₪','ILS',' ','&#8362;','&#x20aa;'],
    ['Italy','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Jamaica','Jamaican dollar','J$','JMD',' ','&#36;','&#x0024;'],
    ['Japan','Japanese yen','¥','JPY','\&yen;','&#165;','&#x00a5;'],
    ['Jersey','British pound','£','GBP','\&pound;','&#163;','&#x00a3;'],
    ['Jordan','Jordanian dinar','د.ا','JOD',' ',' ',' '],
    ['Kazakhstan','Kazakhstani tenge','₸','KZT',' ','&#8376;','&#x20b8;'],
    ['Kenya','Kenyan shilling','KSh','KES',' ',' ',' '],
    ['Korea, North','North Korean won','₩','KPW',' ','&#8361;','&#x20a9;'],
    ['Korea, South','South Korean won','₩','KPW',' ','&#8361;','&#x20a9;'],
    ['Kosovo','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Kuwait','Kuwaiti dinar','د.ك','KWD',' ',' ',' '],
    ['Kyrgyzstan','Kyrgyzstani som','лв','KGS',' ',' ',' '],
    ['Laos','Lao kip','₭','LAK',' ','&#8365;','&#x20ad;'],
    ['Latvia','Latvian lats','Ls','LVL',' ',' ',' '],
    ['Lebanon','Lebanese pound','L£','LBP','\&pound;','&#163;','&#x00a3;'],
    ['Lesotho','Lesotho loti','L','LSL',' ',' ',' '],
    ['Liberia','Liberian dollar','L$','LRD',' ','&#36;','&#x0024;'],
    ['Libya','Libyan dinar','ل.د','LD',' ',' ',' '],
    ['Liechtenstein','Swiss franc','Fr','CHF',' ',' ',' '],
    ['Lithuania','Lithuanian litas','Lt','LTL',' ',' ',' '],
    ['Luxembourg','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Macau','Macanese pataca','P','MOP',' ',' ',' '],
    ['Macedonia, Republic of','Macedonian denar','ден','MKD',' ',' ',' '],
    ['Madagascar','Malagasy ariary','Ar','MGA',' ',' ',' '],
    ['Malawi','Malawian kwacha','MK','MWK',' ',' ',' '],
    ['Malaysia','Malaysian ringgit','RM','MYR',' ',' ',' '],
    ['Maldives','Maldivian rufiyaa','Rf','MVR',' ',' ',' '],
    ['Mali','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Malta','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Marshall Islands','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Mauritania','Mauritanian ouguiya','UM','MRO',' ',' ',' '],
    ['Mauritius','Mauritian rupee','Ɍs','MUR',' ',' ',' '],
    ['Mexico','Mexican peso','$','MXN',' ','&#36;','&#x0024;'],
    ['Micronesia','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Moldova','Moldovan leu','L','MDL',' ',' ',' '],
    ['Mongolia','Mongolian tugrik','₮','MNT',' ','&#8366;','&#x20ae;'],
    ['Montenegro','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Montserrat','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['Morocco','Moroccan dirham','د.م.','MAD',' ',' ',' '],
    ['Mozambique','Mozambican metical','MT','MZN',' ',' ',' '],
    ['Namibia','Namibian dollar','N$','NAD',' ','&#36;','&#x0024;'],
    ['Nauru','Australian dollar','A$','AUD',' ','&#36;','&#x0024;'],
    ['Nepal','Nepalese rupee','NɌs','NPR',' ',' ',' '],
    ['Netherlands','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Netherlands Antilles','Netherlands Antilles guilder','ƒ','ANG',' ',' ',' '],
    ['New Caledonia','CFP franc','F','XPF',' ',' ',' '],
    ['New Zealand','New Zealand dollar','NZ$','NZD',' ','&#36;','&#x0024;'],
    ['Nicaragua','Nicaraguan córdoba','C$','NIO',' ',' ',' '],
    ['Niger','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Nigeria','Nigerian naira','₦','NGN',' ','&#8358;','&#x20a6;'],
    ['Niue','New Zealand dollar','NZ$','NZD',' ','&#36;','&#x0024;'],
    ['Norway','Norwegian krone','kr','NOK',' ',' ',' '],
    ['Oman','Omani rial','ر.ع.','OMR',' ',' ',' '],
    ['Pakistan','Pakistani rupee','Ɍs','PKR',' ',' ',' '],
    ['Palau','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Panama','Panamanian balboa','B/.','PAB',' ',' ',' '],
    ['Papua New Guinea','Papua New Guinea kina','K','PGK',' ',' ',' '],
    ['Paraguay','Paraguayan guarani','₲','PYG',' ','&#8370;','&#x20b2;'],
    ['Peru','Peruvian nuevo sol','S/.','PEN',' ',' ',' '],
    ['Philippines','Philippine peso','₱','PHP',' ','&#8369;','&#x20b1;'],
    ['Pitcairn Islands','New Zealand dollar','NZ$','NZD',' ','&#36;','&#x0024;'],
    ['Poland','Polish zloty','zł','PLN',' ',' ',' '],
    ['Portugal','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Qatar','Qatari riyal','ر.ق','QAR',' ',' ',' '],
    ['Romania','Romanian leu','L','RON',' ',' ',' '],
    ['Russia','Russian ruble','руб','RUB',' ',' ',' '],
    ['Rwanda','Rwandan franc','RF','RWF',' ',' ',' '],
    ['Saba','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Samoa','Samoan tālā','T','WST',' ',' ',' '],
    ['San Marino','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['São Tomé and Príncipe','São Tomé and Príncipe dobra','Db','STD',' ',' ',' '],
    ['Saudi Arabia','Saudi riyal','ر.س','SAR',' ',' ',' '],
    ['Senegal','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Serbia','Serbian dinar','Дин.','RSD',' ',' ',' '],
    ['Seychelles','Seychellois rupee','Ɍs','SCR',' ',' ',' '],
    ['Sierra Leone','Sierra Leonean leone','Le','SLL',' ',' ',' '],
    ['Singapore','Singapore dollar','S$','SGD',' ','&#36;','&#x0024;'],
    ['Slovakia','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Slovenia','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Solomon Islands','Solomon Islands dollar','SI$','SBD',' ','&#36;','&#x0024;'],
    ['Somalia','Somali shilling','So. Sh.','SOS',' ',' ',' '],
    ['Somaliland','Somaliland shilling','Sl. Sh.','None',' ',' ',' '],
    ['South Africa','South African rand','R','ZAR',' ',' ',' '],
    ['South Georgia/South Sandwich Islands','British pound','£','GBP','\&pound;','&#163;','&#x00a3;'],
    ['Spain','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Sri Lanka','Sri Lankan rupee','Ɍs','LKR',' ',' ',' '],
    ['St. Helena','St. Helena pound','£','SHP','\&pound;','&#163;','&#x00a3;'],
    ['St. Kitts and Nevis','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['St. Lucia','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['St. Vincent and the Grenadines','East Caribbean dollar','EC$','XCD',' ','&#36;','&#x0024;'],
    ['Sudan','Sudanese pound','£Sd','SDG','\&pound;','&#163;','&#x00a3;'],
    ['Suriname','Surinamese dollar','$','SRD',' ','&#36;','&#x0024;'],
    ['Swaziland','Swazi lilangeni','L','SZL',' ',' ',' '],
    ['Sweden','Swedish krona','kr','SEK',' ',' ',' '],
    ['Switzerland','Swiss franc','Fr','CHF',' ',' ',' '],
    ['Syria','Syrian pound','S£','SYP','\&pound;','&#163;','&#x00a3;'],
    ['Taiwan (Republic of China)','New Taiwan dollar','NT$','TWD',' ','&#36;','&#x0024;'],
    ['Tajikistan','Tajikistani somoni','SM','TJS',' ',' ',' '],
    ['Tanzania','Tanzanian shilling','TSh','TZS',' ',' ',' '],
    ['Thailand','Thai baht','฿','THB',' ','&#3647;','&#x0e3f;'],
    ['Togo','West African CFA franc','CFA','XOF',' ',' ',' '],
    ['Tonga','Tongan pa’anga','T$','TOP',' ','&#36;','&#x0024;'],
    ['Trinidad and Tobago','Trinidad and Tobago dollar','TT$','TTD',' ','&#x0024;','&#36;'],
    ['Tunisia','Tunisian dinar','د.ت','TND',' ',' ',' '],
    ['Turkey','Turkish lira','TL','TRY',' ',' ',' '],
    ['Turkmenistan','Turkmenistani manat','m','TMT',' ',' ',' '],
    ['Turks and Caicos Islands','US dollar','$','USD',' ','&#36;','&#x0024;'],
    ['Tuvalu','Australian dollar','A$','AUD',' ','&#36;','&#x0024;'],
    ['Uganda','Ugandan shilling','USh','UGX',' ',' ',' '],
    ['Ukraine','Ukrainian hryvnia','₴','UAH',' ','&#8372;','&#x20b4;'],
    ['United Arab Emirates','United Arab Emirates dirham','د.إ','AED',' ',' ',' '],
    ['United Kingdom','British pound','£','GBP','\&pound;','&#163;','&#x00a3;'],
    ['United States','US dollar','US$','USD',' ','&#36;','&#x0024;'],
    ['Uruguay','Uruguayan peso','$U','UYU',' ','&#36;','&#x0024;'],
    ['Uzbekistan','Uzbekistani som','лв','UZS',' ',' ',' '],
    ['Vanuatu','Vanuatu vatu','VT','VUV',' ',' ',' '],
    ['Vatican City','Euro','€','EUR','\&euro;','&#8364;','&#x20ac;'],
    ['Venezuela','Venezuelan bolivar','Bs','VEF',' ',' ',' '],
    ['Vietnam','Vietnamese dong','₫','VND',' ','&#8363;','&#x20ab;'],
    ['Wallis and Futuna','CFP franc','F','XPF',' ',' ',' '],
    ['Yemen','Yemeni rial','﷼','YER',' ','&#65020;','&#xfdfc;'],
    ['Zambia','Zambian kwacha','ZK','ZMK',' ',' ',' '],
    ['Zimbabwe','Zimbabwean dollar','Z$','ZWL','&#36;','&#x0024;']
];