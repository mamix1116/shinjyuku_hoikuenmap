window.FacilityFilter = function () {
};

/**
 * 指定したフィルター条件に一致する施設情報のGeoJsonを生成する
 *
 * @param  {[type]} conditions        [description]
 * @param  {[type]} nurseryFacilities [description]
 * @return {[type]}                   [description]
 */
FacilityFilter.prototype.getFilteredFeaturesGeoJson = function (conditions, nurseryFacilities)
{
    // 絞り込んだ条件に一致する施設を格納するgeoJsonを準備
    var newGeoJson = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features":[]
    };
    // console.log("getFilteredFeaturesGeoJson");

    // 認可保育園の検索元データを取得
    var ninkaFeatures = [];
    _features = nurseryFacilities.features.filter(function (item,idx) {
            var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
            if(type == "認可") return true;
        });
    Array.prototype.push.apply(ninkaFeatures, _features);

    // 認証保育園の検索元データを取得
    var ninsyouFeatures = [];
    _features = nurseryFacilities.features.filter(function (item,idx) {
            var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
            if(type == "認証") return true;
        });
    Array.prototype.push.apply(ninsyouFeatures, _features);

    // 認可外保育園の検索元データを取得
    var ninkagaiFeatures = [];
    _features = nurseryFacilities.features.filter(function (item,idx) {
            var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
            if(type == "認可外") return true;
        });
    Array.prototype.push.apply(ninkagaiFeatures, _features);

    // 幼稚園の検索元データを取得
    // var youchienFeatures = [];
    // _features = nurseryFacilities.features.filter(function (item,idx) {
    //         var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
    //         if(type == "幼稚園") return true;
    //     });
    // Array.prototype.push.apply(youchienFeatures, _features);

    // ----------------------------------------------------------------------
    // 認可保育所向けフィルター
    // ----------------------------------------------------------------------
    // 認可保育所：開園時間
    console.log("[before]ninkaFeatures length:", ninkaFeatures.length);
    if(conditions['ninkaOpenTime']) {
      filterfunc = function (item, idx) {
          f = function (item,idx) {
              switch(conditions['ninkaOpenTime']) {
                  case "7":
                      checkAry = ["7:00"];
                      break;
                  case "8":
                      checkAry = ["7:00", "7:15", "7:30", "8:00"];
                      break;
                  case "9":
                      checkAry = ["7:00", "7:15", "7:30", "8:00", "8:30", "9:00"];
                      break;
                  case "10":
                      checkAry = ["9:00", "9:30", "10:00", "11:00", "13:00"];
                      break;
              }
              var open = item.properties['開園時間'] ? item.properties['開園時間'] : item.properties['Open'];
              if($.inArray(close, checkAry) >= 0) {
                  return true;
              }
          };
          return f(item,idx);
      };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：終園時間
    if(conditions['ninkaCloseTime']) {
        filterfunc = function (item, idx) {
            f = function (item,idx) {
                switch(conditions['ninkaCloseTime']) {
                    case "18":
                        checkAry = ["13:30", "16:00", "17:00", "17:30", "18:00", "18:30", "19:00", "19:15", "19:30", "20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                        break;
                    case "19":
                        checkAry = ["19:00", "19:15", "19:30", "20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                        break;
                    case "20":
                        checkAry = ["20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                        break;
                    case "22":
                        checkAry = ["22:00", "23:00", "0:00", "11:00", "2:00"];
                        break;
                    case "24":
                        checkAry = ["0:00", "11:00", "2:00"];
                        break;
                }
                var close = item.properties['終園時間'] ? item.properties['終園時間'] : item.properties['Close'];
                if($.inArray(close, checkAry) >= 0) {
                    return true;
                }
            };
            return f(item,idx);
        };

        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可外保育所：24時間
    if(conditions['ninka24H']) {
        filterfunc = function (item,idx) {
            var h24 = item.properties['H24'] ? item.properties['H24'] : item.properties['H24'];
            if(h24 !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：一時
    if(conditions['ninkaIchijiHoiku']) {
        filterfunc = function (item,idx) {
            var temp = item.properties['一時'] ? item.properties['一時'] : item.properties['Temp'];
            if(temp !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：夜間
    if(conditions['ninkaYakan']) {
        filterfunc = function (item,idx) {
            var night = item.properties['夜間'] ? item.properties['夜間'] : item.properties['Night'];
            if(night !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：休日
    if(conditions['ninkaKyujitu']) {
        filterfunc = function (item,idx) {
            var holiday = item.properties['休日'] ? item.properties['休日'] : item.properties['Holiday'];
            if(holiday !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：病児・病後児
    if(conditions['ninkaByouji']) {
        filterfunc = function (item,idx) {
            var temp = item.properties['病児'] ? item.properties['病児'] : item.properties['Sick'];
            if(temp !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    // 認可保育所：空き
    if(conditions['ninkaVacancy']) {
        filterfunc = function (item,idx) {
            var vacancy = item.properties['Vacancy'] ? item.properties['Vacancy'] : item.properties['Vacancy'];
            if(vacancy !== null) {
                return true;
            }
        };
        ninkaFeatures = ninkaFeatures.filter(filterfunc);
    }
    console.log("[after]ninkaFeatures length:", ninkaFeatures.length);

    // ----------------------------------------------------------------------
    // 認可外保育所向けフィルター
    // ----------------------------------------------------------------------
    // 認可外：開園時間
    console.log("[before]ninkagaiFeatures length:", ninkagaiFeatures.length);
    if(conditions['ninkagaiOpenTime']) {
        filterfunc = function (item, idx) {
            f = function (item,idx) {
                var _time = conditions['ninkagaiOpenTime'];
                var open = item.properties['開園時間'] ? item.properties['開園時間'] : item.properties['Open'];
                if(open == _time) {
                    return true;
                }
            };
            return f(item,idx);
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外：終園時間
    if(conditions['ninkagaiCloseTime']) {
        filterfunc = function (item, idx) {
            f = function (item,idx) {
                checkAry = [];
                switch(conditions['ninkagaiCloseTime']) {
                  case "18":
                      checkAry = ["13:30", "16:00", "17:00", "17:30", "18:00", "18:30", "19:00", "19:15", "19:30", "20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                      break;
                  case "19":
                      checkAry = ["19:00", "19:15", "19:30", "20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                      break;
                  case "20":
                      checkAry = ["20:00", "20:15", "20:30", "21:00", "21:30", "22:00", "23:00", "0:00", "11:00", "2:00"];
                      break;
                  case "22":
                      checkAry = ["22:00", "23:00", "0:00", "11:00", "2:00"];
                      break;
                  case "24":
                      checkAry = ["0:00", "11:00", "2:00"];
                      break;
                }
                var h24   = item.properties['H24'] ? item.properties['H24'] : item.properties['H24'];
                var close = item.properties['終園時間'] ? item.properties['終園時間'] : item.properties['Close'];
                if(h24 !== null || $.inArray(close, checkAry) >= 0) {
                    return true;
                }
            };
            return f(item,idx);
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：24時間
    if(conditions['ninkagai24H']) {
        filterfunc = function (item,idx) {
            var h24 = item.properties['H24'] ? item.properties['H24'] : item.properties['H24'];
            if(h24 !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：夜間
    if(conditions['ninkagaiYakan']) {
        filterfunc = function (item,idx) {
            var night = item.properties['夜間'] ? item.properties['夜間'] : item.properties['Night'];
            if(night !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：休日
    if(conditions['ninkagaiKyujitu']) {
        filterfunc = function (item,idx) {
            var holiday = item.properties['休日'] ? item.properties['休日'] : item.properties['Holiday'];
            if(holiday !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：病児・病後児
    if(conditions['ninkgaiByouji']) {
        filterfunc = function (item,idx) {
            var temp = item.properties['病児'] ? item.properties['病児'] : item.properties['Sick'];
            if(temp !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：証明あり
    if(conditions['ninkagaiShomei']) {
        filterfunc = function (item,idx) {
            var proof = item.properties['証明'] ? item.properties['証明'] : item.properties['Proof'];
            if(proof !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    // 認可外保育所：空き
    if(conditions['ninkagaiVacancy']) {
        filterfunc = function (item,idx) {
            var vacancy = item.properties['Vacancy'] ? item.properties['Vacancy'] : item.properties['Vacancy'];
            if(vacancy !== null) {
                return true;
            }
        };
        ninkagaiFeatures = ninkagaiFeatures.filter(filterfunc);
    }
    console.log("[after]ninkagaiFeatures length:", ninkagaiFeatures.length);

    // ----------------------------------------------------------------------
    // 幼稚園向けフィルター
    // ----------------------------------------------------------------------
    // まだ用意しない

    // 戻り値の作成
    var features = [];
    Array.prototype.push.apply(features, ninkaFeatures);
    Array.prototype.push.apply(features, ninkagaiFeatures);
    Array.prototype.push.apply(features, youchienFeatures);
    // console.log("getFilteredFeaturesGeoJson: return value: ", features.length);
    newGeoJson.features = features;
    return newGeoJson;
};
