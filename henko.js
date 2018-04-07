// 9/26更新　
// '='マークに対応した

  //
  //  Use a closure to hide the local variables from the
  //  global namespace
  //
  /*
  (function () {  //即時関数はじめ
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null, box = null;    // the element jax for the math output, and the box it's in

    //
    //  Hide and show the box (so it doesn't flicker as much)
    //
    var HIDEBOX = function () {box.style.visibility = "hidden"}
    var SHOWBOX = function () {box.style.visibility = "visible"}

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
      math = MathJax.Hub.getAllJax("MathOutput")[0];
      box = document.getElementById("box");
      SHOWBOX(); // box is initially hidden so the braces don't show
    });

    //
    //  The onchange event handler that typesets the math entered
    //  by the user.  Hide the box, then typeset, then show it again
    //  so we don't see a flash as the math is cleared and replaced.
    //
    window.UpdateMath = function (TeX) {
      QUEUE.Push(
          HIDEBOX,  //function () {box.style.visibility = "hidden"}
          ["resetEquationNumbers",MathJax.InputJax.TeX],
          ["Text",math,"\\displaystyle{"+TeX+"}"],
          SHOWBOX  //function () {box.style.visibility = "visible"}
      );
    }
  })();

  */

  //----------
  var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
  var math = null, box = null;    // the element jax for the math output, and the box it's in

  //
  //  Hide and show the box (so it doesn't flicker as much)
  //
  var HIDEBOX = function () {box.style.visibility = "hidden"}
  var SHOWBOX = function () {box.style.visibility = "visible"}

  //
  //  Get the element jax when MathJax has produced it.
  //
  QUEUE.Push(function () {  //一番最初に呼び出される
    math = MathJax.Hub.getAllJax("MathOutput")[0];
    box = document.getElementById("box");
    // SHOWBOX(); // box is initially hidden so the braces don't show
    //boxを出現させる
  });

  //
  //  The onchange event handler that typesets the math entered
  //  by the user.  Hide the box, then typeset, then show it again
  //  so we don't see a flash as the math is cleared and replaced.
  //

  let latex_inner;
  let latex_inner_tmp = 0;
  let latex_inner_cnt = 0;




  window.UpdateMath = function (TeX) {  //新しい文字列を変換する時に動く





    QUEUE.Push(
        //HIDEBOX,  //function () {box.style.visibility = "hidden"} ボックスを消す
        ["resetEquationNumbers",MathJax.InputJax.TeX],
        ["Text",math,"\\displaystyle{"+TeX+"}"],  //
        //SHOWBOX  //function () {box.style.visibility = "visible"} ボックスを出現をする
    );

    latex_inner = document.getElementById('MathOutput').innerHTML;

    console.log('latex_inner');
    console.log(latex_inner);


    latex_inner_cnt += 1;
  }


  //----------

  function math_change(siki){ //いじるのはこの関数だけでおっけー
    //sikiが入力した文字列
    //今回は,入力が1/2みたいな形式と決まっている
    //const siki_kigo = ['/', '!', '^', '(,', ')', '[', ']', '{', '}', 'sin', 'cos', 'tan', '\\pi']
    var siki_kigo = /sin|cos|tan|[=+\-*!/^(){}\[\]]/gi ;//

    var siki_sp = siki.split(siki_kigo); // 分割し，配列に格納する

    //alert('siki_sp');
    //alert(siki_sp);

    let siki_find = siki.match(siki_kigo); //siki に含まれている記号の配列を返す　記号がなければnullを返す
    let serch_start = 0;
    let kigo_ichi = [];

    let kigo_slice = new Set();

    let siki_sp_kigo = [];
    let slice_start = 0;


    if(siki_find == null){  //記号がないとき
      siki_sp_kigo[0] = siki; //sikiに記号が含まれないとき，siki_findはNULLになるから
      console.log('siki_sp_kigo');
      console.log(siki_sp_kigo);
    }else {

      for (var i = 0; i <= siki_find.length - 1 ; i++) {
        kigo_ichi[i] = siki.indexOf(siki_find[i], serch_start);  //記号の位置を探し，配列に格納
        serch_start = kigo_ichi[i] + siki_find[i].length; //探索を始める場所を毎回変更する

      };

      for (var i1 = 0; i1 < kigo_ichi.length; i1++) {
        kigo_slice.add(kigo_ichi[i1]);
        kigo_slice.add(kigo_ichi[i1] + siki_find[i1].length);
      }


      let kigo_slice_array = [];
      kigo_slice.forEach(function (item) {
        kigo_slice_array.push(item);  //setから配列に変更 setで順番をととのえ，重複を削除する

      });


      for (var i2 = 0; i2 <= kigo_slice_array.length; i2++) {
        if(i2 == kigo_slice_array.length ){
          siki_sp_kigo[i2] = siki.slice(kigo_slice_array[i2 - 1], siki.length +1);
          break;
        }
        siki_sp_kigo[i2] = siki.slice(slice_start, kigo_slice_array[i2]);
        slice_start = kigo_slice_array[i2];
      }

    }

    if(siki_sp_kigo[0] == ''){ //先頭の配列が空のとき
      //console.log("siki_sp_kigo[0] == ''だよ");
      siki_sp_kigo.shift();
    };

    if(siki_sp_kigo[siki_sp_kigo.length - 1] == ''){ //末尾の配列が空のとき
      //console.log("末尾が''だよ");
      siki_sp_kigo.pop();
    };
      //-------------------------------------------  ここまでで記号で区切ってsiki_sp_kigoに格納
    console.log('siki_sp_kigo');  //式を記号で区切って格納
    console.log(siki_sp_kigo);



    function term_last_index(index){  //indexを入れると，項が何番目までか返すプログラム
        if(siki_sp_kigo[index].match(/[+\-*/]/gi)){ //siki_sp_kigo[index]に+-*/が含まれているとindexを返す
          //console.log('これは記号');
          return index;
        }else{   //siki_sp_kigo[index]に+-*/が含まれていないとき
          //console.log('これは項だね');
          let kakko_num = {
            '(' : 0,
            ')' : 0,
            '{' : 0,
            '}' : 0,
            '[' : 0,
            ']' : 0
          }

          while (true) {

            switch (siki_sp_kigo[index]) {
              case '(':
                kakko_num['('] += 1;
                break;
              case ')':
                kakko_num[')'] += 1;
                break;
              case '{':
                kakko_num['{'] += 1;
                break;
              case '}':
                kakko_num['}'] += 1;
                break;
              case '[':
                kakko_num['['] += 1;
                break;
              case ']':
                kakko_num[']'] += 1;
                break;

            }

            function kakkonum_eq(){
              if(kakko_num['('] == kakko_num[')'] &&
                 kakko_num['{'] == kakko_num['}'] &&
                 kakko_num['['] == kakko_num[']']){
                   return true;
                 }else {
                   return false;
                 };
            };
            if( kakkonum_eq() && siki_sp_kigo[index].match(/[+\-*/]/gi)){
              //console.log("正常にbreakしたよ(記号が含まれている)");
              return index - 1;
              break;
            }else if(kakkonum_eq() && index  == siki_sp_kigo.length - 1){
              //console.log("正常にbreakしたよ(末尾に達した)");
              return index ;
              break;
            }else if (index  == siki_sp_kigo.length - 1) {
              //console.log("括弧の数が会わずにbreakしたよ");
              return index ;
              break;
            };
            index += 1;

          }





        };

    };


    let siki_sp_kou = [];

    function Siki_sp_kou(siki_sp_kigo){ //siki_sp_kigoをsiki_sp_kouに変換
      let i_siki_sp_kigo = 0; //siki_sp_kigoのindex
      let i_siki_sp_kou = 0;  //siki_sp_kouのindex


      while (true) {


        siki_sp_kou[i_siki_sp_kou] = new Array();



        for(let i = i_siki_sp_kigo;i <= term_last_index(i_siki_sp_kigo);i++){
          siki_sp_kou[i_siki_sp_kou].push(siki_sp_kigo[i]);
          //siki_sp_kou.push(siki_sp_kigo[i]);
        };



        if(term_last_index(i_siki_sp_kigo) == siki_sp_kigo.length - 1){

          break;

        };
        i_siki_sp_kou += 1;
        i_siki_sp_kigo =  term_last_index(i_siki_sp_kigo) + 1;
      };

    };

    Siki_sp_kou(siki_sp_kigo);

    //console.log('siki_sp_kou');
    //console.log(siki_sp_kou);

    let kakko_num_ary = [];
    let kakko_p = 0; //正括弧の数 1スタート つまり括弧の数
    let kakko_n = 0; //負括弧の数 1スタート

    function kakko_pn(kakko){  //正括弧 return 1 負括弧 return -1 その他false
      switch (kakko) {
        case '(':
          return 1;
          break;
        case ')':
          return -1;
          break;
        case '{':
          return 1;
          break;
        case '}':
          return -1;
          break;
        case '[':
          return 1;
          break;
        case ']':
          return -1;
          break;

        default:
          return false;
      }
    }; //正ならtrue,負ならfalse  //正なら1,負なら-1 //正括弧の時1,負括弧の時-1

    function kakko_last(ary, index){ //ある配列(ary)の正括弧のindexを入れるとそれに対応する負括弧のindexが帰ってくる　括弧の数が合わないなら，配列のラストのindexが帰ってくる．
      let i_index = index;
      let kakko_pn_sum = 0;
      let kakko_first_pn = kakko_pn(ary[i_index]);



      while (true) {
        //console.log('i_index');
        //console.log(i_index);
        if(kakko_pn(ary[i_index])){ //括弧のとき
          kakko_pn_sum += kakko_pn(ary[i_index])
          //console.log('kakko_pn_sum');
          //console.log(kakko_pn_sum);
          //alert(kakko_pn_sum);
          if(kakko_pn_sum == 0 ){
            return i_index;
            break;
          };

        };

        if(ary[i_index + kakko_first_pn] == null ){
          console.log('i_index == ary.length　だよ');
          return i_index;
          break;
        };

        /*if(i_index == ary.length){
          console.log('i_index == ary.length　だよ');
          return i_index;
          break;
        };

        */
        //i_index += 1;
        i_index += kakko_first_pn;
      };
    };

    function kakko_ichi_num(ary){
      //let kakko_num_ary = [];
      let i_index = 0;

      for(let i = 0; i < ary.length; i++){
        kakko_num_ary.push(0);
      };

      //console.log(kakko_num_ary);
      while (true) {
        //console.log('whileの中だよ');
        if(kakko_pn(ary[i_index]) == 1){

              kakko_p += 1;
              kakko_num_ary.splice(i_index, 1, kakko_p);

              kakko_n += -1;
              kakko_num_ary.splice(kakko_last(ary, i_index), 1, kakko_n);

              //console.log(kakko_num_ary);


        };
        //console.log(i_index);
        if(i_index == ary.length - 1){
          break;
        };
        i_index += 1;
      }
      //return kakko_num_ary;
      console.log('kakko_num_ary');
      console.log(kakko_num_ary);
    };  //括弧の位置を　akko_num_aryに格納する  //括弧の位置を数字でkakko_num_aryに格納する

    kakko_ichi_num(siki_sp_kigo);

    //console.log('kakko_ichi_num(siki_sp_kigo)');
    //console.log(kakko_num_ary);
    //console.log(siki_sp_kigo);
    //console.log(kakko_p);


    function return_kakko_ichi(ary, num){   //括弧の中身をreturnする(括弧自体は含まれる)
      //return kakko_num_ary.indexOf(num);
      return ary.slice(kakko_num_ary.indexOf(num), kakko_num_ary.indexOf(num*(-1))+1);
    };

    let latex_kakko_tmp = []; //括弧の中身をlatexに変換して格納
    for(let i=0;i < kakko_p; i++){　　//括弧の要素数を増やす
      latex_kakko_tmp.push('');
    };

    //console.log('latex_kakko_tmp');
    //console.log(latex_kakko_tmp);
    function heibun_latex(ary, num){
      let latex_i;
      latex_kakko_tmp[num] = new Array; //latex_kakko_tmp[num]に格納
      switch (ary[0]) {
        case '(':
          latex_kakko_tmp[num].push('\\left(')
          break;
        case '{':
          latex_kakko_tmp[num].push('\\left{')
          break;
        case '[':
          latex_kakko_tmp[num].push('\\left[')
          break;
      };


      //latex_kakko_tmp[num].push('')
      for(let i=1; i < ary.length - 1; i++){
        switch (true) {
          case /\d/.test(ary[i]):
            //console.log('数字gあるよ');
            latex_kakko_tmp[num].push(ary[i]);
            break;
          case /[+\-]/.test(ary[i]):
            //console.log('[+\-]があるよ');
            latex_kakko_tmp[num].push(ary[i]);
            break;
          case /\*/.test(ary[i]):
            latex_kakko_tmp[num].push("\\times");
            break;
          case /sin/.test(ary[i]):
            latex_kakko_tmp[num].push("\\sin");
            //console.log('sinがあるよ');
            break;
          case /cos/.test(ary[i]):
            latex_kakko_tmp[num].push("\\cos");
            //console.log('cosがあるよ');
            break;
          case /tan/.test(ary[i]):
            latex_kakko_tmp[num].push("\\tan");
            //console.log('tanがあるよ');
            break;
          //case /[^]/.test(ary[i]):
          //case ary[i].match(/\^/):
          case ary[i] == '^':
            latex_kakko_tmp[num].push("\^");
            //console.log(ary[i]);
            //onsole.log('^があるよ');
            break;
          case ary[i] == '/':
            latex_kakko_tmp[num].push("\\verb\| \/ \|");
            //latex_kakko_tmp[num].push('/');
            //console.log('/があるよ');
            break;

          case kakko_pn(ary[i]) == 1:
            //console.log(i);　//4
            //console.log(i + kakko_num_ary.indexOf(num)); //8
            //console.log(latex_kakko_tmp[kakko_num_ary[i + kakko_num_ary.indexOf(num)]].length); //5
            //console.log(kakko_num_ary[i + kakko_num_ary.indexOf(num)]); //3
            for(let i1= 0;i1 < latex_kakko_tmp[kakko_num_ary[i + kakko_num_ary.indexOf(num)]].length;i1++){
              latex_kakko_tmp[num].push(latex_kakko_tmp[kakko_num_ary[i + kakko_num_ary.indexOf(num)]][i1]);

            };
            i = kakko_last(ary, i);
            break;



          default:
          latex_kakko_tmp[num].push(ary[i]);
            //console.log("デフォルト");
            //console.log(ary[i]);
            break;


        }
      };

      switch (ary[ary.length - 1]) {
        case ')':
          latex_kakko_tmp[num].push('\\right)')
          break;
        case '}':
          latex_kakko_tmp[num].push('\\right}')
          break;
        case ']':
          latex_kakko_tmp[num].push('\\right]')
          break;
      };


      return latex_kakko_tmp[num];
    };



    function latex_kakko_tmpto1(ary,num){  //numはkakko_p
      let i_tmp = num;
      while (true) {

        heibun_latex(return_kakko_ichi(ary, i_tmp) ,i_tmp)
        //console.log('i_tmp');
        //console.log(i_tmp);
        //console.log('latex_kakko_tmp[i_tmp]');
        //console.log(latex_kakko_tmp[i_tmp]);
        if(i_tmp <= 1){break;};
        i_tmp -= 1

      }

      latex_kakko_tmp[0] = new Array; //latex_kakko_tmp[num]に格納
      let i1_tmp = 0;
      while (true) {
        if(kakko_pn(siki_sp_kigo[i1_tmp])){
          for(let i1= 0;i1 < latex_kakko_tmp[kakko_num_ary[i1_tmp]].length;i1++){
            latex_kakko_tmp[0].push(latex_kakko_tmp[kakko_num_ary[i1_tmp]][i1]);

          };
          i1_tmp = kakko_last(siki_sp_kigo, i1_tmp) + 1;
        } else {
          //latex_kakko_tmp[0].push(siki_sp_kigo[i1_tmp]);

          switch (true) {
            case /\d/.test(siki_sp_kigo[i1_tmp]):
              //console.log('数字gあるよ');
              latex_kakko_tmp[0].push(siki_sp_kigo[i1_tmp]);
              break;
            case /[+\-]/.test(siki_sp_kigo[i1_tmp]):
              //console.log('[+\-]があるよ');
              latex_kakko_tmp[0].push(siki_sp_kigo[i1_tmp]);
              break;
            case /\*/.test(siki_sp_kigo[i1_tmp]):
              latex_kakko_tmp[0].push("\\times");
              break;
            case /sin/.test(siki_sp_kigo[i1_tmp]):
              latex_kakko_tmp[0].push("\\sin");
              //console.log('sinがあるよ');
              break;
            case /cos/.test(siki_sp_kigo[i1_tmp]):
              latex_kakko_tmp[0].push("\\cos");
              //console.log('cosがあるよ');
              break;
            case /tan/.test(siki_sp_kigo[i1_tmp]):
              latex_kakko_tmp[0].push("\\tan");
              //console.log('tanがあるよ');
              break;
            //case /[^]/.test(ary[i]):
            //case ary[i].match(/\^/):
            case siki_sp_kigo[i1_tmp] == '^':
              latex_kakko_tmp[0].push("\^");
              //console.log(ary[i]);
              //console.log('^があるよ');
              break;
            case siki_sp_kigo[i1_tmp] == '/':
              latex_kakko_tmp[0].push("\\verb\| \/ \|");
              //latex_kakko_tmp[num].push('/');
              //console.log('/があるよ');
              break;

            default:
              latex_kakko_tmp[0].push(siki_sp_kigo[i1_tmp]);
              break;

          };

        i1_tmp += 1;
        };

        if(i1_tmp == siki_sp_kigo.length){break;};
      }



      return latex_kakko_tmp[0];
    };


    let siki_tex = '\\frac{1}{3}';  // \frac{}{}
    //siki_tex = heibun_latex(return_kakko_ichi(siki_sp_kigo, 2) ,2).join('');

    let siki_tex_ary = latex_kakko_tmpto1(siki_sp_kigo,kakko_p);


    let kakko_num_ary_bunsu = kakko_num_ary;
    function bunnsu_last(ary, start_index, pn){  //pnは探索する方向 1の時は右，-1の時は左 '/'が端の時は想定してない
      i = start_index;
      let kakko_pn_sum = 0;
      if(ary[i] != null){
        while (true) {

          if(kakko_pn(ary[i])){ //括弧のとき
            kakko_pn_sum += kakko_pn(ary[i])
            //console.log('kakko_pn_sum');
            //console.log(kakko_pn_sum);
            //alert(kakko_pn_sum);
            if(kakko_pn_sum == 0 ){
              //return i_index;
              //break;
            };

          };



          if(ary[i].match(/[=+\-*]/) && kakko_pn_sum == 0){
            return i -= pn;
          };

          i += pn;
          if(ary[i] == null){
            return i -= pn;
            break;
          };
        };
      }else {
        return start_index -= pn;
      };

    };

    console.log('siki_tex_ary');
    console.log(siki_tex_ary);

    function siki_bunsu(){

      for (let i = 0; i < siki_sp_kigo.length; i++) {  // '/'がある箇所を記憶しとく
        if(siki_sp_kigo[i] == '/'){
          kakko_num_ary_bunsu[i] = '/';
          //console.log('/を入れたよ');
        };
      }

      let i = kakko_p;  //正括弧の数

      while (true) {
          let kakko_nakami_ary
          if(i == 0){
            kakko_nakami_ary = siki_sp_kigo;
          }else if (i > 0) {
            kakko_nakami_ary = return_kakko_ichi(siki_sp_kigo, i);
            kakko_nakami_ary.shift();
            kakko_nakami_ary.pop();  //括弧自体は含まれない
          };
          //let kakko_nakami_ary = return_kakko_ichi(siki_sp_kigo, i);
          //kakko_nakami_ary.shift();
          //kakko_nakami_ary.pop();  //括弧自体は含まれない
          console.log('kakko_nakami_ary');
          console.log(kakko_nakami_ary);
          console.log(i);


          if(i > 0){
          for (let i1 = kakko_nakami_ary.length - 1; i1 >= 0; i1--) {
            if(kakko_nakami_ary[i1] == '/'){



              let bunnsu_last_p = bunnsu_last(kakko_nakami_ary, i1+1, 1);
              let bunnsu_last_n = bunnsu_last(kakko_nakami_ary, i1-1, -1);

              siki_tex_ary[bunnsu_last_p + kakko_num_ary.indexOf(i) + 1] = siki_tex_ary[bunnsu_last_p + kakko_num_ary.indexOf(i) + 1] + '}';

              siki_tex_ary[bunnsu_last_n + kakko_num_ary.indexOf(i) + 1] = '\\frac{' + siki_tex_ary[bunnsu_last_n + kakko_num_ary.indexOf(i) + 1] ;

              siki_tex_ary[i1 + kakko_num_ary.indexOf(i) + 1] = '}{' ;

              console.log(siki_tex_ary);

              console.log(kakko_num_ary.indexOf(i));

              console.log(siki_tex_ary[bunnsu_last_p + kakko_num_ary.indexOf(i) + 1] );
              console.log(siki_tex_ary[bunnsu_last_n + kakko_num_ary.indexOf(i) + 1]);
              console.log(siki_tex_ary[i1 + kakko_num_ary.indexOf(i) + 1] );

              console.log('bunnsu_last_p');
              console.log(bunnsu_last_p);

              console.log('bunnsu_last_n');
              console.log(bunnsu_last_n);

            }else if (kakko_pn(kakko_nakami_ary[i1]) == -1 ) {  // ')'が来た時，その括弧の中身を飛ばす
              console.log(i);
              console.log('最初は)だよ');
              i1 = kakko_last(kakko_nakami_ary, i1);
              console.log(i);
            };
          };
          };


        if(i <= 1){
          break;
        };
        i += -1;

      };

      //console.log('最終仕上げ!!');
      console.log(siki_sp_kigo);
      for (let i1 = siki_sp_kigo.length - 1; i1 >= 0; i1--) {
        if(siki_sp_kigo[i1] == '/'){
          console.log('/があるよ');
          console.log(siki_tex_ary);

          let bunnsu_last_p = bunnsu_last(siki_sp_kigo, i1+1, 1);
          let bunnsu_last_n = bunnsu_last(siki_sp_kigo, i1-1, -1);
          console.log('bunnsu_last_p');
          console.log(bunnsu_last_p); //2
          console.log('bunnsu_last_n');
          console.log(bunnsu_last_n); //0

          siki_tex_ary[bunnsu_last_p] = siki_tex_ary[bunnsu_last_p] + '}';
          siki_tex_ary[bunnsu_last_n] = '\\frac{' + siki_tex_ary[bunnsu_last_n] ;
          siki_tex_ary[i1] = '}{' ;

          console.log('siki_tex_ary[bunnsu_last_p]');
          console.log(siki_tex_ary[bunnsu_last_p]);
          console.log('siki_tex_ary[bunnsu_last_n]');
          console.log(siki_tex_ary[bunnsu_last_n]);
          console.log('siki_tex_ary[i1]');
          console.log(siki_tex_ary[i1]);
        }else if (kakko_pn(siki_sp_kigo[i1]) == -1 ) {  // ')'が来た時，その括弧の中身を飛ばす

          console.log('最初は)だよ');
          i1 = kakko_last(siki_sp_kigo, i1);

        };
      };


    };


    siki_bunsu();

    console.log('kakko_num_ary_bunsu');
    console.log(kakko_num_ary_bunsu);

    console.log('siki_tex_ary');
    console.log(siki_tex_ary);

    siki_tex = siki_tex_ary.join('');

    console.log('siki_tex');
    console.log(siki_tex);



    //document.getElementById("MathOutput0").innerHTML = siki_tex;
    document.getElementById("MathOutput0").value = siki_tex;
    UpdateMath(siki_tex) ;  //siki_texが入力をtex形式にした文字列

  };
