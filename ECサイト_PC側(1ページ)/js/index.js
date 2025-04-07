// 作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕后，在来实现的事件函数
window.onload = function () {

    //声明一个记录点击的缩略图下表
    var bigImgIndex = 0;

    // 路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        /**
         * 动态的实现路径导航的页面元素(navPath)以及</>
         * 先获取页面元素navPath
         * 在获取所需要的数据(data.js->goodData.path)
         * 
         */
        // 获取页面元素对象navPath
        var navPath = document.getElementById("navPath")

        // 获取数据
        var path = goodData.path;
        //遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //创建i标签
                var iNode = document.createElement("i");
                iNode.innerText = '/';
                //追加让navPath追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    //放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 1.获取小图框元素对象，设置移入的事件（onmouserOver[影响到父元素]、onmouseenter）
         * 2.动态的创建蒙版元素以及大图框的元素和大图片
         * 3.移出(onmouseleave)时，移除蒙版元素和大图框
         */

        //1.获取小图框
        var smallPic = document.getElementById("smallPic");

        //获取leftTop元素
        var leftTop = document.getElementById("leftTop");

        //获取数据
        var imgaessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.onmouseenter = function () {

            //3.创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            var BigImg = document.createElement('img');
            // BigImg.src = "images/b1.jpg";
            BigImg.src = imgaessrc[bigImgIndex].b;

            //6. 大图框追加大图片
            BigPic.appendChild(BigImg)

            //7.让小图框追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop的元素追加大图框
            leftTop.appendChild(BigPic);

            //设置移动事件
            smallPic.onmousemove = function (event) {
                // 鼠标点距离浏览器左侧的值
                // .getBoundingClientRect().left:小图框元素距离浏览器左侧可数的left值
                // offsetWidth：元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left
                    - (maskDiv.offsetWidth / 2);

                var top = event.clientY - smallPic.getBoundingClientRect().top
                    - (maskDiv.offsetHeight / 2);

                //判断
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }

                //设置left和top的属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //移动比例的关系=蒙版移动的距离 / 大图片元素移动的距离
                //蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                //大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
                // var scale = (smallPic.clientWidth - maskDiv.offsetWidth) /  (BigImg.offsetWidth - BigPic.clientWidth);              
                // BigImg.style.left = left / scale + "px";
                // BigImg.style.top = top / scale + "px";
                var scale = (BigImg.offsetWidth - BigPic.clientWidth) / (smallPic.clientWidth - maskDiv.offsetWidth);
                BigImg.style.left = -left * scale + "px";
                BigImg.style.top = -top * scale + "px";

            }


            //设置移出事件
            smallPic.onmouseleave = function () {
                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop的元素移除大图框
                leftTop.removeChild(BigPic)
            }
        }
    }

    //动态渲染放大镜缩略图的数据
    thumbnailData()
    function thumbnailData() {
        /**
         * 获取piclist元素下的ul
         * 获取data.js文件下的goodData->imagessrc
         * 遍历数组，根据数组长度创建li元素
         */
        //获取ul元素
        var ul = document.querySelector("#wrapper #content .contentMain #center #left #leftButtom #piclist ul")

        //获取数据
        var imagessrc = goodData.imagessrc;

        //遍历
        for (var i = 0; i < imagessrc.length; i++) {
            //创建li元素
            var newLi = document.createElement('li');
            //创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            //让li追加img元素
            newLi.appendChild(newImg);
            //让ul遍历追加li
            ul.appendChild(newLi);
        }
    }

    //点击缩略图效果
    thumbnailClick()
    function thumbnailClick(event) {
        /**
         * 1.获取所有的li元素
         * 2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src值
         */

        var liNode = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftButtom #piclist ul li');

        var smallPic_img = document.querySelector("#wrapper #content .contentMain #center #left #leftTop #smallPic img");

        var imagesrc = goodData.imagessrc;

        //小图路径需要默认和imagssrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagesrc[0].s;

        //循环点击这些li
        // for (let i = 0;i<liNode.length;i++) {
        //在点击事件之前，给每个元素元素添加自定义下标
        for (var i = 0; i < liNode.length; i++) {
            liNode[i].index = i;/**还可以通过setAttribute('index',i) */
            liNode[i].onclick = function () {
                var idx = this.index;
                //事件函数中的this永远指向的是实际发生事件的目标元对象
                bigImgIndex = idx;

                //变化小图路径
                smallPic_img.src = imagesrc[idx].s;
            }
        }
    }

    //点击缩略图左右箭头的效果
    thumbnailLeftRightClick()
    function thumbnailLeftRightClick() {
        /**
         * 1.获取左右两端的箭头按钮
         * 2.获取可视的div以及ul元素和所有的li元素
         * 3.计算(发生起点、步长、总体运动的距离值)
         * 4.发生点击计算
         */

        //获取箭头元素
        var prev = document.querySelector('#wrapper #content .contentMain #center #left #leftButtom a.prev');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftButtom a.next');

        //获取可视的div和ul元素
        var picList = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftButtom #piclist');
        var ul = document.querySelector("#wrapper #content .contentMain #center #left #leftButtom #piclist ul")
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftButtom #piclist ul li');

        //计算
        var start = 0;
        var step = (liNodes[0].offsetWidth + 20) * 2;

        //总体的距离值 = ul宽度  - div框的宽度 =(图片的总数 - div显示的数量) * (li的宽度+20)
        var endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        //发生时间
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = endPostion
            }
            ul.style.left = -start + "px";
        }

        next.onclick = function () {
            start += step;
            if (start > endPostion) {
                start = 0
            }
            ul.style.left = -start + "px";
        }
    }

    //商品详情数据的动态渲染
    rightTopData()
    function rightTopData() {
        /**
         * 1.查找right元素
         * 2.找到对应数据(goodData->deDetail)
         * 3.建立字符串变量,将原来的布局结构帖进来，将对应的数据放在对应的位置上重新渲染rightTop元素
         * 
         */

        //查找元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop');
        //查找数据
        var goodsDetail = goodData.goodsDetail;

        //创建字符串(模板字符串)变量
        //模板字符串中替换数据 ${变量}
        var s = `<h3>${goodsDetail.title}</h3>
                            <p>${goodsDetail.recommend}</p>
                            <div class="priceWrap">
                                <div class="priceTop">
                                    <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                                    <div class="price">
                                        <span>￥</span>
                                        <p>${goodsDetail.price}</p>
                                        <i>降价通知</i>
                                    </div>
                                    <p>
                                        <span>累计评价</span>
                                        <span>${goodsDetail.evaluateNum}</span>
                                    </p>
                                </div>
                                <div class="priceBottom">
                                    <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                                    <p>
                                        <span>${goodsDetail.promoteSales.type}</span>
                                        <span>${goodsDetail.promoteSales.content}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="support">
                                <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                                <p>${goodsDetail.support}</p>
                            </div>
                            <div class="address">
                                <span>配&nbsp;&nbsp;送&nbsp;&nbsp;至</span>
                                <p>${goodsDetail.address}</p>
                            </div>`;

        //重新渲染rigthTop
        rightTop.innerHTML = s;

    }

    // 商品参数的动态渲染
    rightBottomData()
    function rightBottomData() {
        /**
         * 1.找到rightBottom对象
         * 2.查找数据
         * 3.遍历数组，有一个元素则有一个动态的dl元素
         */

        var chooseWrap = document.querySelector("#wrapper #content .contentMain #center .right .rightBottom .chooseWrap");

        //查找数据
        var crumbData = goodData.goodsDetail.crumbData;

        //循环数据
        for (var i = 0; i < crumbData.length; i++) {
            //创建dl元素对象
            var dlNode = document.createElement('dl');

            //创建dt
            var dtNode = document.createElement('dt');

            dtNode.innerText = crumbData[i].title;

            //dl追加dt
            dlNode.appendChild(dtNode);

            //遍历dd元素
            for (var j = 0; j < crumbData[i].data.length; j++) {
                //创建dd元素
                var ddNode = document.createElement('dd');

                ddNode.innerText = crumbData[i].data[j].type;
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);
                //dl追加dd
                dlNode.append(ddNode);
            }

            //让chooseWrap追加dl
            chooseWrap.appendChild(dlNode)

        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind()
    function clickddBind() {
        /**
         * 1.获取所有的dl元素，取其中第一个dl元素下所有的dd
         * 2.循环所有的dd元素并且添加点击事件
         * 3.确定实际发生时间的目标源对象设置颜色为红色，然后给其他所有的元素颜色重置为基础颜色
         * =======================================
         *
         *  点击dd之后
         * 1.创建一个可以容纳点击的dd元素值的容器
         */
        //1.
        var dlNodes = document.querySelectorAll("#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl");

        var arr = new Array(dlNodes.length);

        var choose = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .choose')
        //数组填充值
        arr.fill(0)

        for (let k = 0; k < dlNodes.length; k++) {

            //闭包函数
            (function () {
                var ddNodes = dlNodes[k].querySelectorAll("dd");
                //遍历所有的dd元素
                for (let i = 0; i < ddNodes.length; i++) {
                    ddNodes[i].onclick = function () {

                        // 清空choose
                        choose.innerHTML = '';
                        for (let j = 0; j < ddNodes.length; j++) {
                            ddNodes[j].style.color = "#666"
                        }
                        this.style.color = "red";

                        //点击dd元素动态的产生新的mark元素
                        arr[k] = this;
                        changPriceBind(arr)
                        //遍历arr数组,将非0元素的值写入mark标记中
                        arr.forEach(
                            function (value, index) {
                                if (value != 0) {
                                    var markNode = document.createElement('div');
                                    markNode.className = "mark";
                                    markNode.innerText = value.innerText;
                                    var aNode = document.createElement("a");
                                    aNode.innerText = "X";
                                    //设置下表
                                    aNode.setAttribute('index', index)

                                    markNode.appendChild(aNode);

                                    choose.appendChild(markNode);
                                }
                            }
                        )
                        //获取所有的a标签元素，并且循环发生点击事件
                        var aNodes = document.querySelectorAll("#wrapper #content .contentMain #center .right .rightBottom .choose .mark a");
                        for (let l = 0; l < aNodes.length; l++) {
                            aNodes[l].onclick = function () {
                                //获取点击的a标签身上的index属性值
                                var idx1 = this.getAttribute('index');
                                //恢复数组中对应下表元素的值
                                choose[idx1] = 0;

                                //查找对应下标的dl行中的dd元素
                                var ddlist = dlNodes[idx1].querySelectorAll('dd');

                                //遍历所有的dd元素
                                for (let m = 0; m < ddlist.length; m++) {
                                    //其余所有的dd文字颜色为灰色
                                    ddlist[m].style.color = '#666';
                                }

                                //默认的第一个dd文字颜色恢复成红色
                                ddlist[0].style.color = 'red';

                                //删除对应下表位置的mark标记
                                choose.removeChild(this.parentNode);
                            }

                        }
                    }
                }
            })()
        }



    }

    //价格变动的函数声明
    /**
     * 函数需要在点击dd以及删除mark标记的时候调用
     */
    function changPriceBind(arr) {
        /**
         * 1.获取价格标签
         * 2.给每个dd标签上默认都设置一个自定义的属性，来记录改变的价格
         * 3.遍历arr数组,将dd元素身上新变化的价格和已有的价格相加
         * 4.将计算后的结果渲染到p中
         * 
         */

        var oldPrice = document.querySelector('#wrapper #content .contentMain #center .right .rightTop .priceWrap .priceTop .price p')

        //取出默认的价格
        var price = goodData.goodsDetail.price

        //遍历arr数组
        for (let i = 0; i < arr.length; i++) {
            //数据类型的强制转换
            var changeprice = Number(arr[i].getAttribute('price'));
            price = price + changeprice
        }

        oldPrice.innerText=price;
    }
}