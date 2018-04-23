/ *！JSON v3.3.2 | http://bestiejs.github.io/json3 | 版权所有2012-2014，Kit Cambridge | http://kit.mit-license.org * /
;（function（）{
  //检测异步模块加载程序公开的`define`函数。该
  //与`r.js`的兼容性需要严格的`define`检查。
  var isLoader = typeof define ===“function”&& define.amd;

  //用于将对象与原语区分开的一组类型。
  var objectTypes = {
    “功能”：真，
    “对象”：真
  };

  //检测由CommonJS实现公开的`exports`对象。
  var freeExports = objectTypes [typeof exports] && exports &&！exports.nodeType && exports;

  //使用节点公开的`global`对象（包括Browserify通过
  //`insert-module-globals`），Narwhal和Ringo作为默认上下文，
  //和浏览器中的“window”对象。Rhino导出一个`global`函数
  //代替
  var root = objectTypes [typeof window] && window || 这个，
      freeGlobal = freeExports && objectTypes [typeof module] && module &&！module.nodeType && typeof global ==“object”&& global;

  if（freeGlobal &&（freeGlobal [“global”] === freeGlobal || freeGlobal [“window”] === freeGlobal || freeGlobal [“self”] === freeGlobal））{
    root = freeGlobal;
  }

  // Public：使用给定的“context”对象初始化JSON 3，附加
  //`stringify`和`parse`函数到指定的`exports`对象。
  函数runInContext（context，exports）{
    上下文|| （context = root [“Object”]（））;
    出口|| （exports = root [“Object”]（））;

    //本机构造函数别名。
    var Number = context [“Number”] || 根[ “编号”]，
        String = context [“String”] || 根[ “字符串”]，
        Object = context [“Object”] || 根[ “对象”]，
        Date = context [“Date”] || 根[ “日期”]，
        SyntaxError = context [“SyntaxError”] || 根[ “的SyntaxError”]，
        TypeError = context [“TypeError”] || 根[ “类型错误”]，
        Math = context [“Math”] || 根[ “数学”]，
        nativeJSON = context [“JSON”] || 根[ “JSON”];

    //委托给本机`stringify`和`parse`实现。
    if（typeof nativeJSON ==“object”&& nativeJSON）{
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    //方便别名
    var objectProto = Object.prototype，
        getClass = objectProto.toString，
        isProperty，forEach，undef;

    //测试`Date＃getUTC *`方法。基于@Yaffle的工作。
    var isExtended = new Date（-3509827334573292）;
    尝试{
      //“getUTCFullYear”，“Month”和“Date”方法返回无名字
      // Opera的某些日期的结果= 10.53。
      isExtended = isExtended.getUTCFullYear（）== -109252 && isExtended.getUTCMonth（）=== 0 && isExtended.getUTCDate（）=== 1 &&
        // Safari <2.0.2正确存储内部毫秒时间值，
        //但是将date方法返回的值剪切到范围
        //签名的32位整数（[-2 ** 31，2 ** 31  -  1]）。
        isExtended.getUTCHours（）== 10 && isExtended.getUTCMinutes（）== 37 && isExtended.getUTCSeconds（）== 6 && isExtended.getUTCMilliseconds（）== 708;
    } catch（exception）{}

    //内部：确定本机的JSON.stringify和parse
    //实现是符合规范的。基于Ken Snyder的工作。
    function has（name）{
      if（has [name]！== undef）{
        //返回缓存的特征测试结果。
        return有[name];
      }
      var isSupported;
      if（name ==“bug-string-char-index”）{
        // IE <= 7不支持使用square访问字符串字符
        //括号符号。IE 8只支持原语。
        isSupported =“a”[0]！=“a”;
      } else if（name ==“json”）{
        //指示“JSON.stringify”和“JSON.parse”是否都是
        // 支持的。
        isSupported = has（“json-stringify”）&& has（“json-parse”）;
      } else {
        var value，serialized ='{“a”：[1，true，false，null，“\\ u0000 \\ b \\ n \\ f \\ r \\ t”]}';
        //测试`JSON.stringify`。
        if（name ==“json-stringify”）{
          var stringify = exports.stringify，stringifySupported = typeof stringify ==“function”&& isExtended;
          if（stringifySupported）{
            //具有自定义`toJSON`方法的测试函数对象。
            （value = function（）{
              返回1;
            }）。toJSON = value;
            尝试{
              stringifySupported =
                // Firefox 3.1b1和b2 serialize string，number和boolean
                //基元作为对象文字。
                stringify（0）===“0”&&
                // FF 3.1b1，b2和JSON 2将包装的图元序列化为对象
                //文字。
                stringify（new Number（））===“0”&&
                stringify（new String（））=='“”'&&
                // FF 3.1b1,2抛出一个错误，如果值为“null”，“undefined”或
                //没有定义规范的JSON表示（这适用于
                //具有`toJSON'属性的对象，*除非*嵌套
                //在对象或数组内）。
                stringify（getClass）=== undef &&
                // IE 8 serializes`undefined` as`“undefined”`。Safari <= 5.1.7和
                // FF 3.1b3通过这个测试。
                stringify（undef）=== undef &&
                // Safari <= 5.1.7和FF 3.1b3 throw`Error`s和`TypeError`s，
                //如果该值完全省略。
                stringify（）=== undef &&
                // FF 3.1b1,2抛出一个错误，如果给定的值不是一个数字，
                // string，array，object，Boolean或'null'literal。这适用于
                //具有自定义`toJSON'方法的对象，除非嵌套
                //内部的对象或数组文字。YUI 3.0.0b1忽略了自定义`toJSON'
                //方法完全
                stringify（value）===“1”&&
                stringify（[value]）==“[1]”&&
                // Prototype <= 1.6.1将`[undefined]`串行化为`“[]”`而不是
                //`“[null]”`。
                stringify（[undef]）==“[null]”&&
                // YUI 3.0.0b1无法序列化`null`文字。
                stringify（null）==“null”&&
                // FF 3.1b1，2如果数组包含一个函数，则停止序列化：
                //`[1，true，getClass，1]`序列化为“[1，true，]”。FF 3.1b3
                //从对象和数组中除去非JSON值，除非它们
                //定义自定义`toJSON`方法。
                stringify（[undef，getClass，null]）==“[null，null，null]”&&
                //简单序列化测试。FF 3.1b1使用Unicode转义序列
                //字符转义码的预期（例如，`\ b` =>`\ u0008`）。
                stringify（{“a”：[value，true，false，null，“\ x00 \ b \ n \ f \ r \ t”]}）== serialized &&
                // FF 3.1b1和b2忽略`filter`和`width`参数。
                stringify（null，value）===“1”&&
                stringify（[1，2]，null，1）==“[\ n 1，\ n 2 \ n]”&&
                // JSON 2，Prototype <= 1.7，而较旧的WebKit构建错误
                //序列化多年。
                stringify（new Date（-8.64e15））=='“-271821-04-20T00：00：00.000Z”'&&
                //在ES 5中，毫秒是可选的，但5.1中需要。
                stringify（new Date（8.64e15））=='“+ 275760-09-13T00：00：00.000Z”'&&
                // Firefox <= 11.0将0之前的年份序列化为负数
                //四位数的年份，而不是六位数的年份。学分：@Yaffle。
                stringify（new Date（-621987552e5））=='“-000001-01-01T00：00：00.000Z”'&&
                // Safari <= 5.1.5和Opera> = 10.53不正确地序列化毫秒
                //值小于1000. Credits：@Yaffle。
                stringify（new Date（-1））=='“1969-12-31T23：59：59.999Z”';
            } catch（exception）{
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        //测试`JSON.parse`。
        if（name ==“json-parse”）{
          var parse = exports.parse;
          if（typeof parse ==“function”）{
            尝试{
              // FF 3.1b1，b2将抛出一个异常，如果提供了一个裸字符。
              //符合实现也应该强制初始参数
              //解析之前的一个字符串。
              if（parse（“0”）=== 0 &&！parse（false））{
                //简单的解析测试。
                value = parse（serialized）;
                var parseSupported = value [“a”]。length == 5 && value [“a”] [0] === 1;
                if（parseSupported）{
                  尝试{
                    // Safari <= 5.1.2和FF 3.1b1允许字符串中未转义的标签。
                    parseSupported =！parse（'“\ t”'）;
                  } catch（exception）{}
                  if（parseSupported）{
                    尝试{
                      // FF 4.0和4.0.1允许引导“+”符号和引导
                      //小数点。FF 4.0,4.0.1和IE 9-10也允许
                      //某些八进制文字。
                      parseSupported = parse（“01”）！== 1;
                    } catch（exception）{}
                  }
                  if（parseSupported）{
                    尝试{
                      // FF 4.0,4.0.1和Rhino 1.7R3-R4允许拖尾十进制
                      //点数 这些环境与FF 3.1b1和2一起，
                      //还允许JSON对象和数组中的逗号。
                      parseSupported = parse（“1。”）！== 1;
                    } catch（exception）{}
                  }
                }
              }
            } catch（exception）{
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has [name] = !! isSupported;
    }

    if（！has（“json”））{
      // Common`[[Class]]``name aliases。
      var functionClass =“[object Function]”，
          dateClass =“[object Date]”，
          numberClass =“[object Number]”，
          stringClass =“[object String]”，
          arrayClass =“[object Array]”，
          booleanClass =“[object Boolean]”;

      //通过索引检测访问字符串字符的不完整支持。
      var charIndexBuggy = has（“bug-string-char-index”）;

      //如果`Date`方法是错误的，定义其他的实用方法。
      if（！isExtended）{
        var floor = Math.floor;
        //一年中的月份与之间的天数之间的映射
        // 1月1日和相应月份的第一个。
        var Months = [0,31,59,90,120,151,181,212,243,273,304,334];
        //内部：计算Unix纪元与之间的天数
        //给定月份的第一天。
        var getDay = function（year，month）{
          返回月份[月] + 365 *（年 -  1970年）+层（（年 -  1969年+（月= +（月> 1）））/ 4） - （（年 -  1901 +月）/ 100） （（年 -  1601 +月）/ 400）;
        };
      }

      //内部：确定属性是否是给定的直接属性
      //对象。代表本机的“Object＃hasOwnProperty”方法。
      if（！（isProperty = objectProto.hasOwnProperty））{
        isProperty = function（property）{
          var members = {}，构造函数;
          if（（members .__ proto__ = null，members .__ proto__ = {
            //最近，* proto *属性不能多次设置
            //版本的Firefox和SeaMonkey。
            “toString”：1
          }，member）.toString！= getClass）{
            // Safari <= 2.0.3不实现`Object＃hasOwnProperty`，但是
            //支持mutable * proto *属性。
            isProperty = function（property）{
              //捕获并破坏对象的原型链（参见第8.6.2节）
              //的ES 5.1规范）。括号表达式阻止了
              //关闭编译器的不安全转换。
              var original = this .__ proto__，result = property in（this .__ proto__ = null，this）;
              //恢复原始的原型链。
              原来的
              返回结果;
            };
          } else {
            //捕获对顶级“Object”构造函数的引用。
            constructor = members.constructor;
            //使用`constructor`属性来模拟`Object＃hasOwnProperty`
            //其他环境
            isProperty = function（property）{
              var parent =（this.constructor || constructor）.prototype;
              返回属性在这个&&！（属性在父&&这个[属性] ===父[属性]）;
            };
          }
          新新旗新新新新新新新新新新新新新新新新新新新名：
          return isProperty.call（this，property）;
        };
      }

      //内部：整合“for ... in”迭代算法
      //环境。每个枚举的键被赋予一个`callback`函数。
      forEach = function（object，callback）{
        var size = 0，属性，成员，属性;

        //测试当前环境中的“for ... in”算法中的错误。该
        //`valueOf`属性继承不可枚举的标志
        //“Object.prototype”在旧版本的IE，Netscape和Mozilla中。
        （Properties = function（）{
          this.valueOf = 0;
        }）。prototype.valueOf = 0;

        //迭代“Properties”类的新实例。
        members = new Properties（）;
        for（会员属性）{
          //忽略从“Object.prototype”继承的所有属性。
          if（isProperty.call（members，property））{
            大小++;
          }
        }
        Properties = members = null;

        //归一化迭代算法。
        if（！size）{
          //继承自Object.prototype的非枚举属性的列表。
          members = [“valueOf”，“toString”，“toLocaleString”，“propertyIsEnumerable”，“isPrototypeOf”，“hasOwnProperty”，“constructor”];
          // IE <= 8，Mozilla 1.0和Netscape 6.2忽略被遮蔽的非可枚举
          //属性。
          forEach = function（object，callback）{
            var isFunction = getClass.call（object）== functionClass，property，length;
            var hasProperty =！isFunction && typeof object.constructor！=“function”&& objectTypes [typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for（property in object）{
              // Gecko <= 1.0枚举下面的函数的`prototype`属性
              // 一定条件下; IE没有。
              if（！（isFunction && property ==“prototype”）&& hasProperty.call（object，property））{
                回调（属性）;
              }
            }
            //为每个不可枚举的属性手动调用回调。
            for（length = members.length; property = members [ -  length]; hasProperty.call（object，property）&& callback（property））;
          };
        } else if（size == 2）{
          // Safari <= 2.0.4枚举阴影属性两次。
          forEach = function（object，callback）{
            //创建一组迭代属性。
            var members = {}，isFunction = getClass.call（object）== functionClass，property;
            for（property in object）{
              //存储每个属性名称以防止双重枚举。该
              //“prototype”属性的函数不是枚举的，因为交叉
              //环境不一致
              if（！（isFunction && property ==“prototype”）&&！！isProperty.call（members，property）&&（members [property] = 1）&& isProperty.call（object，property））{
                回调（属性）;
              }
            }
          };
        } else {
          //没有检测到错误; 使用标准`for ... in`算法。
          forEach = function（object，callback）{
            var isFunction = getClass.call（object）== functionClass，property，isConstructor;
            for（property in object）{
              if（！（isFunction && property ==“prototype”）&& isProperty.call（object，property）&&！（isConstructor = property ===“constructor”））{
                回调（属性）;
              }
            }
            //手动调用`constructor`属性的回调
            //跨环境不一致
            if（isConstructor || isProperty.call（object，（property =“constructor”）））{
              回调（属性）;
            }
          };
        }
        return forEach（object，callback）;
      };

      // public：将JavaScript`value`串行化为JSON字符串。可选
      //`filter`参数可以指定一个改变对象的函数
      //数组成员被序列化，或者是一个字符串和数字的数组
      //指示哪些属性应序列化。可选的“width”
      //参数可以是指定缩进的字符串或数字
      //输出级别。
      if（！has（“json-stringify”））{
        //内部：控制字符及其转义等价物的映射。
        var Escapes = {
          92：“\\\\”
          34：'\\''，
          8：“\\ b”，
          12：“\\ f”，
          10：“\\ n”
          13：“\\ r”
          9：“\\ t”
        };

        //内部：将`value`转换为零填充字符串，使其为
        // length至少等于`width`。`width`必须是<= 6。
        var leadingZeroes =“000000”;
        var toPaddedString = function（width，value）{
          // The`|| 0表示是必要的，以解决一个错误
          // Opera <= 7.54u2其中`0 == -0`，但`String（-0）！==“0”`。
          return（leadingZeroes +（value || 0））。slice（-width）;
        };

        //内部：双引号字符串“值”，替换所有ASCII控件
        //字符（代码单位值介于0和31之间的字符）与
        //他们的转义等价物 这是一个实现
        //“Quote（value）”操作在ES 5.1第15.12.3节中定义。
        var unicodePrefix =“\\ u00”;
        var quote = function（value）{
          var result ='“'，index = 0，length = value.length，useCharIndex =！charIndexBuggy || length> 10;
          var symbols = useCharIndex &&（charIndexBuggy？value.split（“”）：value）;
          for（; index <length; index ++）{
            var charCode = value.charCodeAt（index）;
            //如果字符是控制字符，请附加其Unicode或
            //速记逃逸序列 否则，按原样附加字符。
            switch（charCode）{
              情况8：情况9：情况10：情况12：情况13：情况34：情况92：
                result + = Escapes [charCode];
                打破;
              默认：
                if（charCode <32）{
                  result + = unicodePrefix + toPaddedString（2，charCode.toString（16））;
                  打破;
                }
                result + = useCharIndex？symbols [index]：value.charAt（index）;
            }
          }
          return result +'“';
        };

        //内部：递归序列化一个对象。实施
        //`Str（key，holder）`，`JO（value）`和`JA（value）`操作。
        var serialize = function（property，object，callback，properties，whitespace，indentation，stack）{
          var value，className，year，month，date，time，hours，minutes，seconds，milliseconds，results，element，index，length，prefix，result;
          尝试{
            //支持主机对象。
            value = object [property];
          } catch（exception）{}
          if（typeof value ==“object”&& value）{
            className = getClass.call（value）;
            if（className == dateClass &&！！isProperty.call（value，“toJSON”））{
              if（value> -1 / 0 && value <1/0）{
                //日期按照Date＃toJSON方法进行序列化
                //在ES 5.1第15.9.5.44节中指定。见第15.9.1.15节
                //为ISO 8601日期时间字符串格式。
                if（getDay）{
                  //手动计算年，月，日，小时，分钟，
                  //秒，如果`getUTC *`方法是毫秒
                  //越野车 改编自@ Yaffle的“date-shim”项目。
                  date = floor（value / 864e5）;
                  for（year = floor（date / 365.2425）+ 1970  -  1; getDay（year + 1，0）<= date; year ++）;
                  for（month = floor（（date-getDay（year，0））/ 30.42）; getDay（year，month + 1）<= date; month ++）;
                  date = 1 + date  -  getDay（年，月）;
                  //“time”值指定一天中的时间（见ES）
                  // 5.1 section 15.9.1.2）。使用公式“（A％B + B）％B”
                  //计算“A模B”，如“％”运算符不
                  //对应于负号的“模数”运算。
                  time =（value％864e5 + 864e5）％864e5;
                  //由小时，分钟，秒和毫秒获得
                  //分解一天中的时间。见第15.9.1.10节。
                  小时=楼层（时间/ 36e5）％24;
                  minutes = floor（time / 6e4）％60;
                  秒= floor（时间/ 1e3）％60;
                  毫秒=时间％1e3;
                } else {
                  year = value.getUTCFullYear（）;
                  month = value.getUTCMonth（）;
                  date = value.getUTCDate（）;
                  hours = value.getUTCHours（）;
                  minutes = value.getUTCMinutes（）;
                  seconds = value.getUTCSeconds（）;
                  milliseconds = value.getUTCMilliseconds（）;
                }
                //正确序列化延长的年份。
                value =（year <= 0 || year> = 1e4？（year <0？“ - ”：“+”）+ toPaddedString（6，year <0？-year：year）：toPaddedString（4，year））+
                  “ - ”+ toPaddedString（2，month + 1）+“ - ”+ toPaddedString（2，date）+
                  //月份，日期，小时，分钟和秒应该有两个
                  //数字; 毫秒应该有三个。
                  “T”+ toPaddedString（2，hours）+“：”+ toPaddedString（2，minutes）+“：”+ toPaddedString（2，seconds）+
                  //毫秒在ES 5.0中是可选的，但在5.1中需要。
                  “” + toPaddedString（3，milliseconds）+“Z”;
              } else {
                value = null;
              }
            } else if（typeof value.toJSON ==“function”&&（（className！= numberClass && className！= stringClass && className！= arrayClass）|| isProperty.call（value，“toJSON”）））{
              // Prototype <= 1.6.1添加非标准的toJSON方法
              //“Number”，“String”，“Date”和“Array”原型。JSON 3
              //忽略这些对象上的所有`toJSON'方法，除非它们是
              //直接在实例上定义。
              value = value.toJSON（property）;
            }
          }
          if（callback）{
            //如果提供了替换功能，请调用它来获取该值
            //用于序列化
            value = callback.call（object，property，value）;
          }
          if（value === null）{
            返回“null”;
          }
          className = getClass.call（value）;
          if（className == booleanClass）{
            //布尔值是字面上的。
            返回“”+值;
          } else if（className == numberClass）{
            // JSON数字必须是有限的。“Infinity”和“NaN”被序列化为
            //`“null”`。
            返回值> -1 / 0 &&值<1/0？“”+ value：“null”;
          } else if（className == stringClass）{
            //字符串是双引号和转义的。
            return quote（“”+ value）;
          }
          //递归序列化对象和数组。
          if（typeof value ==“object”）{
            //检查循环结构。这是线性搜索; 性能
            //与唯一嵌套对象的数量成反比。
            for（length = stack.length; length--;）{
              if（stack [length] === value）{
                //循环结构不能被JSON.stringify序列化。
                抛出TypeError（）;
              }
            }
            //将对象添加到已遍历对象的堆栈中。
            stack.push（值）;
            results = [];
            //保存当前缩进级别并缩进一个附加级别。
            前缀=缩进;
            缩进+ =空格;
            if（className == arrayClass）{
              //递归序列化数组元素。
              for（index = 0，length = value.length; index <length; index ++）{
                element = serialize（index，value，callback，properties，whitespace，indentation，stack）;
                results.push（element === undef？“null”：element）;
              }
              result = results.length？（“空格”）“\ n”+ indentation + results.join（“，\ n”+ indentation）+“\ n”+前缀+“]”：（“[”+ results.join（“，”）+ ]“））：”[]“;
            } else {
              //递归序列化对象成员。会员选自
              //用户指定的属性名称列表或对象
              //本身
              forEach（properties || value，function（property）{
                var element = serialize（property，value，callback，properties，whitespace，indentation，stack）;
                if（element！== undef）{
                  //根据ES 5.1第15.12.3节：“如果`gap` {空格}
                  //不是空字符串，让`member` {quote（property）+“：”}
                  //是“会员”和“空格”字符的连接。
                  //“空格”字符是指文字空间
                  //字符，而不是提供的`space` {width}参数
                  //`JSON.stringify`。
                  result.push（quote（property）+“：”+（whitespace？“”：“”）+ element）;
                }
              }）;
              result = results.length？（“空格”）“{\ n”+ indentation + results.join（“，\ n”+ indentation）+“\ n”+前缀+“}”：（“{”+ results.join（“，”）+ }“））：”{}“;
            }
            //从对象堆栈中移除对象。
            stack.pop（）;
            返回结果;
          }
        };

        // Public：`JSON.stringify`。见ES 5.1第15.12.3节。
        exports.stringify = function（source，filter，width）{
          var空格，回调，属性，className;
          if（objectTypes [typeof filter] && filter）{
            if（（className = getClass.call（filter））== functionClass）{
              callback = filter;
            } else if（className == arrayClass）{
              //将属性名称数组转换为临时集合。
              properties = {};
              for（var index = 0，length = filter.length，value; index <length; value = filter [index ++]，（（className = getClass.call（value）），className == stringClass || className == numberClass）&& （properties [value] = 1））;
            }
          }
          if（width）{
            if（（className = getClass.call（width））== numberClass）{
              //将`width`转换为整数，并创建一个包含的字符串
              //`width`空格字符数。
              if（（width  -  = width％1）> 0）{
                for（whitespace =“”，width> 10 &&（width = 10）; whitespace.length <width; whitespace + =“”）;
              }
            } else if（className == stringClass）{
              whitespace = width.length <= 10？width：width.slice（0，10）;
            }
          }
          // Opera <= 7.54u2放弃与空字符串键相关联的值
          //（``“`）只有当它们直接在对象成员列表中使用时
          //（例如`！（“”in {“”：1}）`）。
          return serialize（“”，（value = {}，value [“”] = source，value），回调，属性，空格，“”，[]）;
        };
      }

      // Public：解析JSON源字符串。
      if（！has（“json-parse”））{
        var fromCharCode = String.fromCharCode;

        //内部：一个转义控制字符及其未转义的映射
        //等同。
        var Unescapes = {
          92：“\\”
          34：'''
          47：“/”，
          98：“\ b”，
          116：“\ t”，
          110：“\ n”，
          102：“\ f”，
          114：“\ r”
        };

        //内部：存储解析器状态。
        var Index，Source;

        //内部：重置分析器状态并抛出一个“SyntaxError”。
        var abort = function（）{
          Index = Source = null;
          throw SyntaxError（）;
        };

        // Internal：如果解析器已经到达，则返回下一个令牌，或者“$”`
        //源字符串的结尾。令牌可能是一个字符串，数字`null`
        //文字或布尔文字。
        var lex = function（）{
          var source = Source，length = source.length，value，begin，position，isSigned，charCode;
          while（Index <length）{
            charCode = source.charCodeAt（Index）;
            switch（charCode）{
              情况9：情况10：情况13：情况32：
                //跳过空格令牌，包括制表符，回车符，行
                // feed和空格字符。
                指数++;
                打破;
              情况123：情况125：情况91：情况93：情况58：情况44：
                //解析标点符号（`{`，`}`，`[`，`]`，`：`或`，`）
                //当前位置
                value = charIndexBuggy？source.charAt（Index）：source [Index];
                指数++;
                返回值
              案例34：
                //```分隔一个JSON字符串;前进到下一个字符和
                //开始解析字符串。字符串令牌前缀
                // sentinel`@`字符，以区别于标点符号和
                //结束字符串令牌。
                for（value =“@”，Index ++; Index <length;）{
                  charCode = source.charCodeAt（Index）;
                  if（charCode <32）{
                    //未转义的ASCII控制字符（具有代码单元的字符）
                    //小于空格字符）不允许。
                    中止（）;
                  } else if（charCode == 92）{
                    //反向的固定线（`\`）标志着转义的开始
                    //控制字符（包括```，`\`和`/`）或Unicode
                    //转义序列。
                    charCode = source.charCodeAt（++ Index）;
                    switch（charCode）{
                      外壳92：外壳34：外壳47：外壳98：外壳116：外壳110：外壳102：外壳114：
                        //恢复转义的控制字符。
                        值+ = Unescapes [charCode];
                        指数++;
                        打破;
                      案例117：
                        //`\ u`标记Unicode转义序列的开始。
                        //提前到第一个字符并验证
                        //四位数代码点。
                        begin = ++索引;
                        for（position = Index + 4; Index <position; Index ++）{
                          charCode = source.charCodeAt（Index）;
                          //有效序列包括四个十六进制（case-
                          //不敏感），形成一个十六进制值。
                          if（！（charCode> = 48 && charCode <= 57 || charCode> = 97 && charCode <= 102 || charCode> = 65 && charCode <= 70））{
                            //无效的Unicode转义序列。
                            中止（）;
                          }
                        }
                        //恢复转义的字符
                        值+ = fromCharCode（“0x”+ source.slice（begin，Index））;
                        打破;
                      默认：
                        //转义序列无效
                        中止（）;
                    }
                  } else {
                    if（charCode == 34）{
                      //一个未转义的双引号字符标记的结尾
                      // string。
                      打破;
                    }
                    charCode = source.charCodeAt（Index）;
                    begin =索引;
                    //针对字符串有效的常见情况进行优化。
                    while（charCode> = 32 && charCode！= 92 && charCode！= 34）{
                      charCode = source.charCodeAt（++ Index）;
                    }
                    //按照原样追加字符串。
                    value + = source.slice（begin，Index）;
                  }
                }
                if（source.charCodeAt（Index）== 34）{
                  //提前到下一个字符并返回复原的字符串。
                  指数++;
                  返回值
                }
                //未终止的字符串
                中止（）;
              默认：
                //解析数字和文字。
                begin =索引;
                //超过负号，如果指定了。
                if（charCode == 45）{
                  isSigned = true;
                  charCode = source.charCodeAt（++ Index）;
                }
                //解析整数或浮点值。
                if（charCode> = 48 && charCode <= 57）{
                  //前导零被解释为八进制文字。
                  if（charCode == 48 &&（charCode = source.charCodeAt（Index + 1）），charCode> = 48 && charCode <= 57））{
                    //非法八进制文字。
                    中止（）;
                  }
                  isSigned = false;
                  //解析整数组件。
                  for（; Index <length &&（（charCode = source.charCodeAt（Index）），charCode> = 48 && charCode <= 57）; Index ++）;
                  //浮点数不能包含一个小数点; 不过这个
                  //解析器已经解决了这个情况。
                  if（source.charCodeAt（Index）== 46）{
                    position = ++索引;
                    //解析小数组件。
                    for（; position <length &&（（charCode = source.charCodeAt（position）），charCode> = 48 && charCode <= 57）; position ++）;
                    if（position == Index）{
                      //非法拖尾十进制。
                      中止（）;
                    }
                    指数=位置
                  }
                  //解析指数。“e”表示指数
                  // 不区分大小写。
                  charCode = source.charCodeAt（Index）;
                  if（charCode == 101 || charCode == 69）{
                    charCode = source.charCodeAt（++ Index）;
                    //跳过指数之后的符号，如果是
                    //指定。
                    if（charCode == 43 || charCode == 45）{
                      指数++;
                    }
                    //解析指数分量。
                    for（position = Index; position <length &&（（charCode = source.charCodeAt（position）），charCode> = 48 && charCode <= 57）; position ++）;
                    if（position == Index）{
                      //非法空指数。
                      中止（）;
                    }
                    指数=位置
                  }
                  //将解析的值强制为JavaScript编号。
                  return + source.slice（begin，Index）;
                }
                //负号可能只在数字之前。
                if（isSigned）{
                  中止（）;
                }
                //`true`，`false`和`null`文字。
                if（source.slice（Index，Index + 4）==“true”）{
                  索引+ = 4;
                  返回真
                } else if（source.slice（Index，Index + 5）==“false”）{
                  指数+ = 5;
                  返回假;
                } else if（source.slice（Index，Index + 4）==“null”）{
                  索引+ = 4;
                  返回null;
                }
                //无法识别的令牌
                中止（）;
            }
          }
          //如果解析器到达结束，返回哨兵`$`字符
          //的源字符串。
          返回“$”;
        };

        //内部：解析一个JSON'值'标记。
        var get = function（value）{
          var结果，hasMembers;
          if（value ==“$”）{
            //输入意外的结束
            中止（）;
          }
          if（typeof value ==“string”）{
            if（（charIndexBuggy？value.charAt（0）：value [0]）==“@”）{
              //删除哨兵`@`字符。
              return value.slice（1）;
            }
            //解析对象和数组文字。
            if（value ==“[”）{
              //解析一个JSON数组，返回一个新的JavaScript数组。
              results = [];
              for（;; hasMembers ||（hasMembers = true））{
                value = lex（）;
                //关闭方括号标记数组文字的结尾。
                if（value ==“]”）{
                  打破;
                }
                //如果数组文字包含元素，当前的标记
                //应该是从前面的元素分隔的逗号
                // 下一个。
                if（hasMembers）{
                  if（value ==“，”）{
                    value = lex（）;
                    if（value ==“]”）{
                      //在数组文字中意外拖出`，`。
                      中止（）;
                    }
                  } else {
                    // A`，`必须分隔每个数组元素。
                    中止（）;
                  }
                }
                //不允许出现错误和引用逗号。
                if（value ==“，”）{
                  中止（）;
                }
                results.push（获取（值））;
              }
              返回结果;
            } else if（value ==“{”）{
              //解析一个JSON对象，返回一个新的JavaScript对象。
              results = {};
              for（;; hasMembers ||（hasMembers = true））{
                value = lex（）;
                //关闭大括号标记对象文字的结尾。
                if（value ==“}”）{
                  打破;
                }
                //如果对象文字包含成员，当前的标记
                //应该是一个逗号分隔符。
                if（hasMembers）{
                  if（value ==“，”）{
                    value = lex（）;
                    if（value ==“}”）{
                      //对象文字中的意外尾随`，`。
                      中止（）;
                    }
                  } else {
                    // A`，`必须分隔每个对象成员。
                    中止（）;
                  }
                }
                //不允许引用逗号，对象属性名必须是
                //双引号字符串，而`：`必须分隔每个属性
                //名称和值。
                if（value ==“，”|| typeof value！=“string”||（charIndexBuggy？value.charAt（0）：value [0]）！=“@”|| lex（）！=“：”） {
                  中止（）;
                }
                result [value.slice（1）] = get（lex（））;
              }
              返回结果;
            }
            //遇到意外的令牌
            中止（）;
          }
          返回值
        };

        //内部：更新已遍历的对象成员。
        var update = function（source，property，callback）{
          var element = walk（source，property，callback）;
          if（element === undef）{
            删除源[属性];
          } else {
            source [property] = element;
          }
        };

        //内部：递归地遍历被解析的JSON对象，调用该对象
        //每个值的`callback`函数。这是一个实现
        //“Walk（holder，name）”操作在ES 5.1第15.12.2节中定义。
        var walk = function（source，property，callback）{
          var value = source [property]，length;
          if（typeof value ==“object”&& value）{
            //`forEach`不能用于遍历Opera <= 8.54中的数组
            //因为它的“Object＃hasOwnProperty”实现返回`false`
            //对于数组索引（例如`！[1，2，3] .hasOwnProperty（“0”）`）。
            if（getClass.call（value）== arrayClass）{
              for（length = value.length; length--;）{
                update（value，length，callback）;
              }
            } else {
              forEach（value，function（property）{
                update（value，property，callback）;
              }）;
            }
          }
          return callback.call（source，property，value）;
        };

        // Public：`JSON.parse`。见ES 5.1第15.12.2节。
        exports.parse = function（source，callback）{
          var result，value;
          索引= 0;
          Source =“”+ source;
          result = get（lex（））;
          //如果一个JSON字符串包含多个令牌，它是无效的。
          if（lex（）！=“$”）{
            中止（）;
          }
          //重置解析器状态。
          Index = Source = null;
          return callback && getClass.call（callback）== functionClass？walk（（value = {}，value [“”] = result，value），“”，回调）：result;
        };
      }
    }

    exports [“runInContext”] = runInContext;
    退货出口;
  }

  if（freeExports &&！isLoader）{
    //为CommonJS环境导出。
    runInContext（root，freeExports）;
  } else {
    //导出为Web浏览器和JavaScript引擎。
    var nativeJSON = root.JSON，
        previousJSON = root [“JSON3”]，
        isRestored = false;

    var JSON3 = runInContext（root，（root [“JSON3”] = {
      // Public：恢复全局“JSON”对象的原始值
      //返回对“JSON3”对象的引用。
      “noConflict”：function（）{
        if（！isRestored）{
          isRestored = true;
          root.JSON = nativeJSON;
          root [“JSON3”] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        返回JSON3;
      }
    }））;

    root.JSON = {
      “parse”：JSON3.parse，
      “stringify”：JSON3.stringify
    };
  }

  //异步模块装载机导出。
  if（isLoader）{
    define（function（）{
      返回JSON3;
    }）;
  }
}）调用（这）;