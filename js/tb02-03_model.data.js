/*
 * tb02-03_model.data.js
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
 *
 * Typebomb 2 model component.
*/
/*global $, tb02*/

// == BEGIN MODULE tb02._03_model_._data_ =============================
tb02._03_model_._data_ = (function () {
  // == BEGIN MODULE SCOPE VARIABLES ==================================
  'use strict';
  var
    aMap = tb02,
    nMap = aMap._nMap_,
    vMap = aMap._vMap_,

    __0    = nMap._0_,
    __util = aMap._01_util_,

    bigBombWordList = [ '717273949', '90fdx093', 'cambria_01.', 'elephantdinosaur',
        'crazycrazycrazy', 'dingobingo999.>,', 'gta89898~~', 'earplugs2000',
        'mozillabananabread', 'orangatangwalnuts', ';emon;rass'
    ],

    wordSetList = [
      [ ';lkjh', ';lkj', 'adds', 'ah', 'alas', 'alfalfa', 'alada', 'all',
        'asdf', 'asdfg', 'ash', 'ask', 'hash', 'fall', 'fdsa', 'flag',
        'flash', 'flask', 'gall', 'gash', 'gfdsa', 'glad', 'glass', 'had',
        'hall', 'gallap', 'falk', 'fad', 'half', 'hall', 'has', 'hash',
        'jkl;', 'hjkl', 'hjkl;', 'lad', 'lag', 'lash', 'lass', 'sad', 'salad',
        'sash', 'shall', 'slag'
      ],
      [ 'aladan', 'alderman', 'day', 'dagger', 'day;', 'depth', 'do',
        'dug', 'feat', 'fell', 'fight', 'flay', 'gate', 'go', 'guide',
        'gypsy', 'hash;', 'her', 'here;', 'hit;', 'if', 'is;', 'its',
        'jaw', 'lair', 'lake', 'law', 'light', 'ogre', 'paw', 'peat',
        'peep', 'pit', 'play', 'poiuy', 'quaff', 'quail', 'quail;',
        'quash', 'quell', 'quest', 'queue;', 'quill', 'qwert', 'rage;',
        'rail', 'rash', 'rate', 'rest', 'sale', 'saw', 'sill;', 'slide',
        'slit', 'stop', 'sure', 'take', 'tale', 'that;', 'the', 'their',
        'there', 'these;', 'this', 'those', 'tide;', 'tight', 'till',
        'trash', 'trewq', 'tug', 'two;', 'typed', 'typist;', 'urge',
        'use;', 'usher', 'wages', 'wake', 'wary;', 'well', 'why', 'will',
        'wire', 'with', 'yap', 'yaw', 'yell;', 'yippee;', 'your', 'yuiop',
        'yuiop;'
      ],
      [ './', '/.', 'Aback.', 'Aging.', 'Bap.', 'Bate.', 'Being.',
        'Blot.', 'Bump.', 'Clash.', 'Decay.', 'Faxing.', 'Feline.',
        'Hiking.', 'Lean.', 'Meat.', 'Nice.', 'Office.', 'Prank.',
        'Rink.', 'Sump.', 'Turnip.', 'Typing.', 'Vexing.', 'Vine.',
        'Wombat.', 'abbot.', 'admit', 'advice', 'aflame/', 'back',
        'bishop.', 'block.', 'bvcxz', 'by', 'chill', 'choke', 'coop/',
        'crick', 'daring.', 'divide', 'exit', 'fan', 'flock', 'groan',
        'king', 'knight/', 'knit.', 'mail', 'mate', 'mix', 'mn',
        'muffin', 'nicest', 'nm', 'paving', 'ping/', 'pink', 'plain',
        'rein/', 'revoke.', 'rice', 'roman', 'scoot', 'shrink', 'sing/',
        'skunk.', 'snick', 'stump', 'sultan', 'thump', 'track', 'trying',
        'turbot', 'twine', 'vilest', 'wean', 'win', 'zest', 'zip',
        'zxcvb'
      ],
      [ 'A1 S2', 'a1 S2', 'A1 s2', 'a1 s2',
        'D3 F4', 'd3 F4', 'D3 f4', 'd3 f4',
        'G5 H6', 'g5 H6', 'G5 h6', 'g5 h6',
        'J7 K8', 'j7 K8', 'J7 k8', 'j7 k8',
        'L9 ;10', 'l9 ;10',
        'A0 S9', 'a0 S9', 'A0 s9', 'a0 s9',
        'D8 F7', 'd8 F7', 'D8 f7', 'd8 f7',
        'G6 H5', 'g6 H5', 'G6 h5', 'g6 h5',
        'J4 K3', 'j4 K3', 'J4 k3', 'j4 k3',
        'L2 ;1', 'l2 ;1', ';1 L2', ';1 l2',
        'K3 J4', 'k3 J4', 'K3 j4', 'k3 j4',
        'H5 G6', 'h5 G6', 'H5 g6', 'h5 g6',
        'F7 D8', 'f7 D8', 'F7 d8', 'f7 d8',
        'S9 A0', 's9 A0', 'S9 a0', 's9 a0',
        'K8 J7', 'k8 J7', 'K8 j7', 'k8 j7',
        ';0 l9', ';0 L9',
        'H6 G5', 'h6 G5', 'H6 g5', 'h6 g5',
        'F4 D3', 'f4 D3', 'F4 d3', 'f4 d3',
        'S2 A1', 's2 A1', 'S2 a1', 's2 a1',
        'AB S8', 'ab S8', 'Ab S8', 'ab s8',
        'A2 S3', 'a2 S3', 'A2 s3', 'a2 s3',
        'D3 F4', 'd3 F4', 'd3 F4', 'd3 f4'
      ],
      [ 'Algeria', 'Austria', 'Australia', 'Belgium', 'Bergen', 'Crete',
        'Croatia', 'Czech Republic', 'Egypt', 'France', 'Germany', 'Iraq',
        'Italy', 'Krakow', 'Kuwait', 'Lebanon', 'Libya', 'Luxembourg',
        'Malta', 'Morocco', 'Norway', 'Poland', 'Portugal', 'Prague',
        'Qatar', 'Sardinia', 'Saudi Arabia', 'Sicily', 'Spain', 'Stockholm',
        'Sweden', 'Sytia', 'Tunisia', 'Turkey', 'United Kingdom',
        'United States', 'Warsaw'
      ],
      [ '`12345', '67890-=', '54321`', '=-09876', '~`_-+=', '54321',
        '12345', '09876', '67890', '12345, 67890', '09876, 54321',
        '490, 268', '053, 218.12', '507, 825.3', '501.809, 640,',
        '015 Sofia', '09876 Copenhagan', '09876 Reykjavik',
        '10 London 86', '102938 Madrid', '1110 Tokyo',
        '123 Gold Coast, 33', '12345 Amsterdam', '54321 Dublin',
        '125, E. Paris', '1296 Jedda', '12th Floor',
        '158 State, Geelong', '16598 W. Roots, Perth',
        '2948.86 Kyoto', '2E, Second Floor', '3289.10 Tokyo',
        '3338 Wakayama', '4441 Lubin', '45113 E. Route',
        '489 Brisbane', '49.23 Al Qamishili', '591 Cario',
        '6665.76 Sendai', '6758.49 Okazaki', '87,65,43 Canberra',
        '9153 E. 2nd Street', '9863.15 Chiba', '9991 Nara',
        '9l 0 Bergen', 'Adelaide, 8976 E.', 'Brussels 54321',
        '657 East Joondalup', 'Madrid 67890', 'Melbourne, 123 W.',
        'Paris 184C', 'Stockholm 0643', '963 E. Rd., Albany',
        'Wollongong, 291'
      ],
      [ '"use strict"', '!@#$% ^&*()_', '~!@#$% ^&*()_+',
        '+_()()*&^ %$#@!~', 'You must be joking!', 'Are you joking?',
        'if ( x ^ n !== bad_num ) {}', 'if ( idx > 25 ) {}',
        'for ( i = 0;)', '( i = 0; i < count; i++ )',
        'switch( lesson_count ) {}', 'throw error_obj;',
        'for ( idx in ref_list ) {}', 'class_str = \'blue-\'',
        '+ String( idx );', 'key_list = Object.keys( list );',
        'list.push( scalar_key );', 'if ( j === 25 ) { break; }',
        '_regex = /%!%([^%]+)%!%/g;', 'replace_fn = function ()',
        'return lookup_map[ name ];', 'fn = function ( arg_map ) {}',
        'square_int = 9638^2', 'ordinal = in_num ^ exponent_int;',
        '{ name : "Henery" };'
      ]
    ],

    // A list of indicies of recently used words (set in initModule)
    wordSetIdxList,

    // Utility methods

    // Public methods
    getWord, initModule, getBigBombWord
    ;
  // == . END MODULE SCOPE VARIABLES ==================================

  // == BEGIN UTILITY METHODS =========================================
  // == . END UTILITY METHODS =========================================

  // == BEGIN PUBLIC METHODS ==========================================
  // BEGIN public method /getWord/
  // Purpose: Get word from shuffled list.
  //   * max_set_idx is the maximum difficulty level allowed
  //     for returned word
  //   * weight_ratio is how heavily to weight the selection towards
  //     the higher difficulty.  If weight_ratio = 1, *all* words will
  //     come from the highest level (max_set_idx), wherease if
  //     weight_ratio = __0 random distribution should occur.
  //
  getWord = function ( max_set_idx, weight_ratio ) {
    var
      dice_ratio = vMap._makeRandomNumFn_(),
      set_idx, word_idx_map, word_idx, word_count, word_str
      ;

    // Get the level for selected word using weighting
    // to favor highest level if required
    //
    set_idx = ( dice_ratio > weight_ratio )
      ? vMap._makeFloorNumFn_( vMap._makeRandomNumFn_() * max_set_idx )
      : max_set_idx
      ;

    // Extract word from set
    word_idx_map = wordSetIdxList[ set_idx ];
    word_idx     = word_idx_map._idx_;
    word_count   = word_idx_map._count_;
    word_str     = wordSetList[ set_idx ][ word_idx ];

    // Increment word index and store
    word_idx++;
    if ( word_idx >= word_count ) { word_idx = __0; }
    word_idx_map._idx_ = word_idx;

    // Return selected word
    return word_str;
  };
  // . END public method /getWord/

  // BEGIN public method /initModule/
  // Purpose: Shuffles the words in the data and initializes indicies
  //
  initModule = function () {
    var
      set_count = wordSetList[ vMap._length_ ],
      i, word_list, word_count
      ;


    // Shuffle all word sets; initialize indicies for each
    //
    wordSetIdxList = [];
    for ( i = __0; i < set_count; i++ ) {
      word_list = wordSetList[ i ];
      __util._shuffleList_( word_list );
      word_count = word_list[ vMap._length_ ];
      wordSetIdxList[ i ] = { _idx_ : __0, _count_ : word_count };
    }
  };
  // . END public method /initModule/

  // START public method /getBigBomb/
  getBigBombWord = function () {
    var idx = Math.floor( Math.random()*bigBombWordList.length + 1 );
    return bigBombWordList[ idx ];
  };
  // . END public method /getBigBomb/
  return {
    _getWord_        : getWord,
    _initModuleFn_   : initModule,
    _getBigBombWord_ : getBigBombWord
  };
  // == . END PUBLIC METHODS ==========================================
}());
// == . END MODULE tb02._03_model_._data_ =============================
