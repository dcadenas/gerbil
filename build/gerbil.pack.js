var Gerbil=function(c,b,a){this.success=0;this.failures=0;this.count=0;this.timeout=0;this.logger=typeof a=="object"?a:Gerbil.logger;this.queue=new Gerbil.Queue;this.results=new Gerbil.Queue;this.description=c;this.tests=b;this.extractTest=function(d){var e=this.tests[d];delete this.tests[d];return e||function(){}};this.execute=function(f,e){this.scope=e;try{f.fn.call(e,f)}catch(d){f.fails(d)}finally{this.results.push(f)}};this.ok=function(d){this.success++;d.scenario.logger.log(Gerbil.format("   * {0} ({1} assertions)",[d.name,d.assertions]))};this.fail=function(d){this.failures++;d.scenario.logger.error(Gerbil.format("   x {0} - assertion number {1} failed - {2}",[d.name,d.assertions+1,d.message]))};this.postergate=function(d){d.scenario.logger.warn("   ! "+d.message)};this.enqueue=function(){this.setup=this.extractTest("setup");this.before=this.extractTest("before");this.after=this.extractTest("after");this.cleanup=this.extractTest("cleanup");for(var d in this.tests){this.queue.push(new Gerbil.Test(d,this.tests[d],this));this.count++}return this};this.run=function(){var f=false;var e={};try{this.setup.call(e);do{f=this.queue.pull();if(f){this.before.call(e,f);f.measure();this.execute(f,e);f.measure();this.after.call(e,f)}}while(f);this.cleanup.call(e)}catch(d){throw Gerbil.Error(d)}finally{setTimeout(function(g){g.summary()},this.timeout,this)}};this.summary=function(){var d=false;var f=0;var e=0;this.logger.info("== Running "+this.description+" ==");do{test=this.results.pull();if(test){if(test.isPending){this.postergate(test)}else{f+=test.assertions;e+=test.time;test.failed?this.fail(test):this.ok(test)}}}while(test);this.logger.warn(Gerbil.format("All tests completed for {0}: {1} passed, {2} failed of {3} tests ({4} assertions) in {5} s",[this.description,this.success,this.failures,this.count,f,e]));this.logger.info("")};this.enqueue()};Gerbil.IS_NODE=!!(typeof module!=="undefined"&&module.exports);Gerbil.format=function(c,a){var b=/\{([^}]+)\}/g;return c.replace(b,function(e,d){return a[d]})};Gerbil.Error=function(b){if(arguments.length===2){b=Gerbil.format(arguments[0],arguments[1])}var a=new Error(b);return a.stack||a.message};Gerbil.Queue=function(){this.queue=[];this.offset=0;this.length=function(){return this.queue.length-this.offset};this.push=function(a){this.queue.push(a)};this.pull=function(){if(this.queue.length===0){return false}var a=this.queue[this.offset];if(++this.offset*2>=this.queue.length){this.queue=this.queue.slice(this.offset);this.offset=0}return a}};Gerbil.Test=function(a,c,b){this.name=a;this.scenario=b;this.fn=c;this.assertions=0;this.failed=false;this.isPending=false;this.message=null;this.time=null;this.fails=function(d){this.failed=true;this.message=d};this.measure=function(){var d=new Date().getTime()/1000;this.time=this.time===null?d:d-this.time}};Gerbil.Test.prototype={setTimeout:function(c,a){var b=this.scenario.scope;this.scenario.timeout+=a;return setTimeout(function(){c.apply(b)},a)},pending:function(a){this.isPending=true;this.message=a},assert:function(a){if(!a){throw Gerbil.Error("Assertion Failed")}else{this.assertions++}},assertThrow:function(d,c){this.assertions++;var a=false;try{c();a=d.name+" was expected but not raised."}catch(b){if(typeof b==typeof d){a=d.name+" was expected but "+b.name+" was raised."}}if(a){throw Gerbil.Error(a)}},assertEqual:function(d,b){if(d==undefined||b==undefined){throw Gerbil.Error("attr2 = {0} ({1}) and attr2 = {2} ({3})",[d,typeof d,b,typeof b])}if(typeof(d)!=typeof(b)){throw Gerbil.Error("Different type {0} vs {1}",[typeof d,typeof b])}this.assertions++;var a="Not equal {0} != {1}";switch(d.constructor){case Array:if(d.length!=b.length){throw Gerbil.Error("Different Lengths")}for(var c=0;c<d.length;c++){if(d[c]!=b[c]){throw Gerbil.Error(a,[d[c],b[c]])}}break;case String:case Number:if(d!=b){throw Gerbil.Error(a,[d,b])}break;default:break}}};Gerbil.Logger={pretty:{log:function(a){return console.log("\033[32m"+a+"\033[0m")},info:function(a){return console.info("\033[34m"+a+"\033[0m")},warn:function(a){return console.warn("\033[33m"+a+"\033[0m")},error:function(a){return console.error("\033[31m"+a+"\033[0m")}},simple:console};Gerbil.logger=Gerbil.IS_NODE?Gerbil.Logger.pretty:Gerbil.Logger.simple;Gerbil.scenario=function(c,b,a){new Gerbil(c,b,a).run()};if(Gerbil.IS_NODE){module.exports=Gerbil}else{var scenario=Gerbil.scenario};