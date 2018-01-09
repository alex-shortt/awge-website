/*
 ____    ____          _            
|_   \  /   _|        (_)           
  |   \/   |   ,--.   __   _ .--.   
  | |\  /| |  `'_\ : [  | [ `.-. |  
 _| |_\/_| |_ // | |, | |  | | | |  
|_____||_____|\'-;__/[___][___||__] 
Main.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Main
*/
var noise;
var smartphones = "screen and (max-width: 480px) and (orientation: portrait), screen and (max-height: 480px) and (orientation: landscape)";

function initImageGlitch() {
    jQuery.fn.noisy = function(opts) {
        opts = jQuery.extend({}, jQuery.fn.noisy.defs, opts);
        var instance = this;

        var _pt = [{
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 0
        }];

        var element = jQuery(this);
        var rnd1 = [Math.random() + 1, Math.random() + 1, Math.random() + 1];
        var rnd2 = [0, 0, 0];
        var cnt = 0;
        var arr = [];
        var loop = null;
        var t = null;
        var rows = opts.rows;
        var ratio = opts.ratio;
        var img = opts.img;
        var mshov = false;
        var id = opts.id;

        this.run = function() {
            var i;
            for (i = 0; i < 3; i++) {
                if (rnd1[i] >= 1) {
                    --rnd1[i];
                    rnd2[i] = Math.random() / 4 + 0.03;
                }
                rnd1[i] += rnd2[i];
                cnt += (38 - cnt) * 0.25;
                _pt[i].x = Math.ceil(Math.sin(rnd1[i] * Math.PI * 2) * rnd2[i] * cnt * 2);
                _pt[i].y = 0;
            }
            var num = (Math.abs(_pt[0].x) + Math.abs(_pt[1].x) + Math.abs(_pt[2].x) + 8) / 4;

            i = rows;
            while (i -= 1) {
                var _off = Math.sin(i / rows * Math.PI * (Math.random() / 8 + 1)) * 0.8 * num * num;
                arr[i].css({
                    transform: "translateZ(0) translate3d(0, 0, 0) translateX(" + _off + "px)",
                    webkitTransform: "translateZ(0) translate3d(0, 0, 0) translateX(" + _off + "px)"
                });
            }
        }

        this.go = function() {
            mshov = true;
            clearInterval(loop);
            loop = setInterval(this.run, 30);
        }

        this.pause = function() {
            mshov = false;
            clearInterval(loop);
            loop = null;

            for (var i = 0; i < rows; i++) {
                arr[i].css({
                    transform: "translateZ(0) translate3d(0, 0, 0)",
                    webkitTransform: "translateZ(0) translate3d(0, 0, 0)"
                });
            }
        }

        this.updateContainerBounds = function() {
            var containerWidth = $(id).outerWidth();
            var containerHeight = $(id).outerHeight();

            if (ratio < (containerHeight / containerWidth)) {
                var newHeight = containerWidth * ratio;
                element.css({
                    height: newHeight + "px",
                    padding: (containerHeight - newHeight) / 2 + "px 0px"
                });
            }
            else {
                var newWidth = containerHeight / ratio;
                element.css({
                    height: containerHeight + "px",
                    padding: "0px " + (containerWidth - newWidth) / 2 + "px"
                });
            }
        }

        this.changeImage = function(newImage) {
            var containerWidth = $(id).outerWidth();
            var containerHeight = $(id).outerHeight();

            var img = new Image();
            img.onload = function() {
                ratio = this.height / this.width;

                for (var i = 0; i < rows; i++) {
                    element.find("div").eq(i).css({
                        backgroundImage: "url(" + newImage + ")",
                    });
                }

                if (ratio < (containerHeight / containerWidth)) {
                    var newHeight = containerWidth * ratio;
                    element.css({
                        height: newHeight + "px",
                        padding: (containerHeight - newHeight) / 2 + "px 0px"
                    });
                }
                else {
                    var newWidth = containerHeight / ratio;
                    element.css({
                        height: containerHeight + "px",
                        padding: "0px " + (containerWidth - newWidth) / 2 + "px"
                    });
                }
            }
            img.src = newImage;
        }

        element.css({
            position: "relative",
            padding: "0px calc((430px - " + (430 * ratio) + "px) / 2)"
        });

        for (var i = 0; i < rows; i++) {
            var pos = (i * 100 / rows) + "%";
            element.append("<div></div>");
            element.find("div").eq(i).css({
                backgroundImage: "url(" + img + ")",
                backgroundPosition: "0px " + (pos == "0%" ? "0.2%" : pos),
                backgroundSize: "cover",
                width: "100%",
                flex: "1",
                cursor: "pointer",
                transform: "translateZ(0) translate3d(0, 0, 0)",
                webkitTransform: "translateZ(0) translate3d(0, 0, 0)"
            });
            arr.push(element.find("div").eq(i));
        }

        if (opts.auto) {
            t = setInterval(function() {
                if (mshov) return;
                instance.go();

                setTimeout(instance.pause(), opts.delay / 2 * Math.random());
            }, opts.delay);
        }

        this.initialize = function() {
            return this;
        }

        return this.initialize();
    };

    jQuery.fn.noisy.defs = {
        rows: 0,
        ratio: 1,
        img: "",
        auto: false,
        delay: 7000
    };
}

function initModal() {
    $(".modal-open").on('click', function(e) {
        var $this = $(this),
            modal = $($this).data("modal");

        $(modal).parents(".modal-overlay").addClass("modal-opened");
        setTimeout(function() {
            $(modal).addClass("modal-opened");
        }, 350);

        $(document).on('click', function(e) {
            var target = $(e.target);

            if ($(target).hasClass("modal-overlay")) {
                $(target).find(".modal-modal").each(function() {
                    $(this).removeClass("modal-opened");
                });
                setTimeout(function() {
                    $(target).removeClass("modal-opened");
                }, 350);
            }
        });
    });

    $(".modal-close").on('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation;

        var $this = $(this),
            modal = $($this).data("modal");

        $(modal).removeClass("modal-opened");
        setTimeout(function() {
            $(modal).parents(".modal-overlay").removeClass("modal-opened");
        }, 350);

    });
}

function openModal(modal) {
    if (modal.indexOf("#") == -1) {
        modal = "#" + modal;
    }

    $(modal).parents(".modal-overlay").addClass("modal-opened");
    setTimeout(function() {
        $(modal).addClass("modal-opened");
    }, 350);

    $(document).on('click', function(e) {
        var target = $(e.target);

        if ($("#model-modal").hasClass("modal-opened"))
            return;

        if ($(target).hasClass("modal-overlay")) {
            $(target).find(".modal-modal").each(function() {
                $(this).removeClass("modal-opened");
            });
            setTimeout(function() {
                $(target).removeClass("modal-opened");
            }, 350);
        }
    });
}

function closeModal(modal) {
    if (modal.indexOf("#") == -1) {
        modal = "#" + modal;
    }
    $(modal).removeClass("modal-opened");
    setTimeout(function() {
        $(modal).parents(".modal-overlay").removeClass("modal-opened");
    }, 350);
}

function isSafari() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            return false;
        }
        else {
            return true;
        }
    }
}

function turnScreenOn(secs) {
    if (isSafari()) {
        $(".awge-content").css("-webkit-animation", "turn-on-safari " + secs + "s linear");
    }
    else {
        $(".awge-content").css("animation", "turn-on " + secs + "s linear");
    }
}

function turnScreenOff(secs) {
    if (isSafari()) {
        $(".awge-content").css("-webkit-animation", "turn-off-safari " + secs + "s linear forwards");
    }
    else {
        $(".awge-content").css("animation", "turn-off " + secs + "s linear forwards");
    }
}

function preloader() {
    var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var img5 = new Image();
    var img6 = new Image();
    var img7 = new Image();
    var img8 = new Image();
    var img9 = new Image();
    var img10 = new Image();
    var img11 = new Image();

    img1.src = "https://dwvo2npct47gg.cloudfront.net/gifs/question-block.gif";
    img2.src = "https://dwvo2npct47gg.cloudfront.net/gifs/cellphone.gif";
    img3.src = "https://dwvo2npct47gg.cloudfront.net/gifs/home-background.gif";
    img4.src = "https://dwvo2npct47gg.cloudfront.net/gifs/shirts_1.gif";
    img5.src = "https://dwvo2npct47gg.cloudfront.net/gifs/shirts_2.gif";
    img6.src = "https://dwvo2npct47gg.cloudfront.net/gifs/hats_1.gif";
    img7.src = "https://dwvo2npct47gg.cloudfront.net/gifs/hats_2.gif";
    img8.src = "https://dwvo2npct47gg.cloudfront.net/gifs/hats_3.gif";
    img9.src = "https://dwvo2npct47gg.cloudfront.net/gifs/asap.gif";
    img10.src = "https://dwvo2npct47gg.cloudfront.net/gifs/carti.gif";
    img10.src = "https://dwvo2npct47gg.cloudfront.net/gifs/green-shoe.gif";
}

function notify(message) {
    $('#notify-message').text(message.toUpperCase());
    openModal('notify-modal');
}

function startTextGlitch() {
    $(".shop-glitch-placeholder").addClass("shop-glitch");
}

function stopTextGlitch() {
    $(".shop-glitch-placeholder").removeClass("shop-glitch");
}

function initTerms() {
    $(".awge-terms").on("click", function() {
        window.location.hash = "terms";
    });
    $(".awge-privacy").on("click", function() {
        window.location.hash = "privacy";
    });
}

function printCredits() {
    console.log("                                                        \
            \n      _  ____      ____   ______  ________                 \
            \n     / \\|_  _|    |_  _|.' ___  ||_   __  |               \
            \n    / _ \\ \\ \\  /\\  / / / .'   \\_|  | |_ \\_|          \
            \n   / ___ \\ \\ \\/  \\/ /  | |   ____  |  _| _             \
            \n _/ /   \\ \\_\\  /\\  /   \\ `.___]  |_| |__/ |           \
            \n|____| |____|\\/  \\/     `._____.'|________|              \
            \n____________________________________________               \
            \n____________________________________________               \
            \n                                                           \
            \nCreated by Ilya Zaidze and Alex Shortt                     \
            \nAlex Shortt :: Developer                                   \
            \n  >Twitter: @_alexshortt                                   \
            \n  >Instagram: @alexander.shortt                            \
            \nIlya Zaidze :: Creative + Design                           \
            \n  >Twitter: @ilya2x                                        \
            \n  >Instagram: @ilya2x                                      \
            ");
}

function isMobileView() {
    var mq = window.matchMedia(smartphones);
    return mq.matches;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/*
 _______                       _    _                   
|_   __ \                     / |_ (_)                  
  | |__) |,--.   .--./) ,--. `| |-'__   .--.   _ .--.   
  |  ___/`'_\ : / /'`\;`'_\ : | | [  |/ .'`\ \[ `.-. |  
 _| |_   // | |,\ \._//// | |,| |, | || \__. | | | | |  
|_____|  \'-;__/.',__` \'-;__/\__/[___]'.__.' [___||__] 
               ( ( __))                                 
Pagation.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Pagation
*/

function initHash() {
    $(window).hashchange(function() {
        var hash = location.hash;
        var cleanHash = (hash.replace(/^#/, '') || 'blank').split("?")[0];

        switch (cleanHash) {
            case 'blank':
                changePage("./pages/landing.html", 3.4);
                break;
            case 'home':
                changePage("./pages/home.html", 3.4);
                break;
            case 'about':
                changePage("./pages/about.html", 3.4);
                break;
            case 'contact':
                changePage("./pages/contact.html", 3.4);
                break;
            case 'shop':
                changePage("./pages/shop.html", 3.4);
                break;
            case 'checkout':
                changePage("./pages/checkout.html", 3.4);
                break;
            case 'videos':
                changePage("./pages/videos.html", 3.4);
                break;
            case 'pictures':
                changePage("./pages/pictures.html", 3.4);
                break;
            case 'privacy':
                changePage("./pages/privacy.html", 3.4);
                break;
            case 'terms':
                changePage("./pages/terms.html", 3.4);
                break;
            case 'awgeDVD':
                changePage("./pages/awgeDVD.html", 3.4);
                break;
            case 'awgeDVD-vol-1':
                changePage("./pages/awgeDVD-vol-1.html", 3.4);
                break;
            case 'awgeDVD-vol-2':
                changePage("./pages/awgeDVD-vol-2.html", 3.4);
                break;
            case 'media':
                changePage("./pages/media.html", 3.4);
                break;
            default:
                changePage("./pages/error.html", 3.4);
                break;
        }
    });

    $(window).hashchange();
}

function landingLoad() {
    $(document).keypress(function(e) {
        if (e.which == 13) {
            if (window.location.hash == "") {
                window.location.hash = "home";
            }
        }
    });

    $('#landing-start-button').click(function() {
        window.location.hash = "home";
    });
}

function homeLoad() {
    $('.shop-button').click(function() {
        window.location.hash = "shop";
    });
    $('.about-button').click(function() {
        window.location.hash = "about";
    });
    $('#home-awgeDVD').click(function() {
        window.location.hash = "awgeDVD";
    });
    $('#pictures-button').click(function() {
        window.location.hash = "awgeDVD";
    });
    $('.contact-button').click(function() {
        window.location.hash = "contact";
    });
    $('.home-video-gif').click(function() {
        window.location.hash = "media";
    });
    $('.home-video-text').click(function() {
        window.location.hash = "media";
    });
    $('home-navbar-text').click(function() {
        window.location.hash = "home";
    });
    $("#home-video-wrapper-mobile").click(function() {
        window.location.hash = "media";
    });
}

function contactLoad() {
    $('#contact-send').click(function() {
        if ($('#contact-email').val() == "" || $('#contact-subject').val() == "" || $('#contact-message').val() == "") {
            notify("Fill in all fields");
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "./scripts/email.php?email=" + encodeURIComponent($('#contact-email').val()) + "&subject=" + encodeURIComponent($('#contact-subject').val()) + "&message=" + encodeURIComponent($('#contact-message').val(), true));
        xhr.send();

        $('#contact-email').val("");
        $('#contact-subject').val("");
        $('#contact-message').val("");
        notify("MESSAGE SENT");
    });

    autosize($("#contact-email"));
    autosize($("#contact-subject"));
    autosize($("#contact-message"));
}

function shopLoad() {
    $('#shop-option-shirts').click(function() {
        changeShopType("shirts");
    });

    $('#shop-option-hats').click(function() {
        changeShopType("hats");
    });

    $('#shop-item-decrease').click(function() {
        changeShopPage(-1);
    });

    $('#shop-item-increase').click(function() {
        changeShopPage(1);
    });

    $('#shop-buy-button').click(function() {
        if (!isOutOfStock(currentItem.type + "-" + currentItem.index + "-" + currentItem.size))
            addToCart();
    });

    $('#cart-checkout').click(function() {
        cleanCart();
        if (Object.keys(getCart()).length == 0)
            return;

        closeModal("cart-modal");

        openCheckoutLink();

        //window.location.hash = "checkout";
    });

    $('.shop-items-item').click(function() {
        loadModel(currentItem.type + "_" + currentItem.index);
        var localPrice = shop[currentItem.type][currentItem.index].price == "Sold Out" ? "Sold Out" : "$" + shop[currentItem.type][currentItem.index].price;
        $("#model-price").text("$" + localPrice);
    });

    var img = new Image();
    img.onload = function() {
        $("#shop-item").html("");

        noise = $("#shop-item").noisy({
            rows: 250,
            img: shop.shirts[1].image,
            ratio: this.height / this.width,
            id: "#shop-item"
        });

        window.addEventListener('resize', function() {
            noise.updateContainerBounds();
        });

        $("#shop-item-mobile").css("background-image", "url(" + shop.shirts[1].image);

        changeShopType("shirts");
    }
    img.src = shop.shirts[1].image;
    refreshCart();
}

function checkoutLoad() {
    if (Object.keys(getCart()).length <= 0) {
        window.location.hash = "shop"
    }

    //global
    $("#cancel-order").on('click', function() {
        exitCheckout();
        window.location.hash = "shop";
    });

    setCheckoutPage('checkout-checkout');

    //checkout
    $("#checkout-subtotal").html("$" + getCartSubtotal().toFixed(2));

    $("#continue-shopping").on('click', function() {
        window.location.hash = "shop";
    });

    $("#continue-to-shipping").on('click', function() {
        setCheckoutPage('checkout-shipping');
    });

    displayCartCheckout('#checkout-items');

    //shipping
    $("#continue-to-billing").on('click', function() {
        if (!validateShipping()) {
            return;
        }

        setCheckoutPage('checkout-billing');
    });

    $("#back-to-checkout").on('click', function() {
        setCheckoutPage('checkout-checkout');
    });

    //billing
    $("#continue-to-confirmation").on('click', function() {
        completeBilling();
    });

    $("#back-to-shipping").on('click', function() {
        setCheckoutPage('checkout-shipping');
    });

    $("#credit-card-number").on('input', function() {
        var value = $("#credit-card-number").val();
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || '';
        var parts = [];
        for (i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            $("#credit-card-number").val(parts.join(' '));
        }
        else {
            $("#credit-card-number").val(value);
        }
    });

    //confirmation
    $("#place-order").on('click', function() {
        $(this).css("cursor", "context-menu");
        $(this).css("color", "#afafaf");
        chargeOrder();
    });

    $("#back-to-billing").on('click', function() {
        if (orderData != null) {
            $.ajax({
                method: 'POST',
                url: 'https://awge-server.herokuapp.com/cancelOrder',
                data: {
                    order: orderData.orderToken
                }
            });
        }
        setCheckoutPage('checkout-billing');
    });

    displayCartCheckout('#confirmation-items');
}

function messageLoad() {
    $('#message-order-num').text(orderData.num);

    $("#checkout-close-button").on('click', function() {
        localStorage['cart'] = "";
        window.location.hash = "";
    });
}

function videosLoad() {
    var carousel = $(".videos-carousel-carousel");
    var numVids = Object.keys(videos).length;
    var centerVideo = (Math.round((numVids + 1) / 2));
    currentVideo = centerVideo;
    buildVideoPlayer();

    $("#videos-info-title").text(videos[currentVideo].title);
    $("#videos-info-title").attr("data-text", videos[currentVideo].title);
    $("#videos-info-description").text(videos[currentVideo].desc);
    $("#videos-info-description").attr("data-text", videos[currentVideo].desc);

    $("#videos-info-next").on("click", function() {
        rotateVideo(1, 1);
    });
    $("#videos-info-prev").on("click", function() {
        rotateVideo(-1, 1);
    });

    $("#videos-carousel-third").swipe({
        swipe: function(event, direction, distance, duration, fingerCount) {
            if (direction == "left") rotateVideo(1, 0.7);
            if (direction == "right") rotateVideo(-1, 0.7);
        }
    });

    var id = getParameterByName("id");
    if (videos[id] != null) {
        openFullscreenVideo(id, true);
    }
    else {
        window.location.hash = "videos";
    }
}

// function picturesLoad() {
//     $(".pictures-image").on('click', function() {
//         if ($(this).hasClass("pictures-video")) {
//             console.log($(this).prop('muted'));
//             $(this).prop('muted', !$(this).prop('muted'));
//         }
//         else {
//             var src = $(this).attr("src");
//             $("#pictures-modal-image").attr("src", src);
//             openModal("pictures-modal");
//         }
//     });
// }

function picturesLoad() {
    $(".pictures-container").click(function() {
        $(".pictures-container").toggleClass('pictures-max-container');
    });
}

function awgeDVDVolLoad() {
    $("#dvd-video").on('click', function() {
        toggleVideoPlay("#dvd-video");
    });

    $("#dvd-video").get(0).load();

    /*
    $("#dvd-video").on('click', function() {
        window.location.hash = "home";
    });

    $(document).ready(function() {
        var x = setInterval(function() {
            if ($("#dvd-video").get(0).paused) {
                $("#dvd-video").get(0).play();
            }
            else {
                clearInterval(x);
                console.log("ok");
            }
        }, 500)
    });
    */
}

function toggleVideoPlay(id) {
    if (!$(id).get(0).paused) {
        !$(id).get(0).pause()
    }
    else {
        !$(id).get(0).play();
    }
}

function awgeDVDLoad() {
    $("#dvd-video").on('click', function() {
        window.location.hash = "home";
    });

    $("#awgedvd-vol-1").on('click', function() {
        window.location.hash = "awgeDVD-vol-1";
    });
    $("#awgedvd-vol-2").on('click', function() {
        window.location.hash = "awgeDVD-vol-2";
    });
}

function mediaLoad() {
    $('#media-videos').click(function() {
        window.location.hash = "videos";
    });
    $('#media-pictures').click(function() {
        window.location.hash = "pictures";
    });
}

function loadPage(dir, time) {
    $("#awge-content").load(dir, function() {
        $("#awge-tube-border").removeClass("awge-tube-border-mobile");

        switch (dir) {
            case "./pages/landing.html":
                $("#awge-tube-border").addClass("awge-tube-border-mobile");
                landingLoad();
                break;
            case "./pages/home.html":
                homeLoad();
                break;
            case "./pages/contact.html":
                contactLoad();
                break;
            case "./pages/shop.html":
                shopLoad();
                break;
            case "./pages/checkout.html":
                checkoutLoad();
                break;
            case "./pages/videos.html":
                videosLoad();
                break;
            case "./pages/pictures.html":
                picturesLoad();
                break;
            case "./pages/awgeDVD.html":
                awgeDVDLoad();
                break;
            case "./pages/awgeDVD-vol-1.html":
                awgeDVDVolLoad();
                break;
            case "./pages/awgeDVD-vol-2.html":
                awgeDVDVolLoad();
                break;
            case "./pages/media.html":
                mediaLoad();
                break;
            default:
                break;
        }

        $("#awge-home").click(function() {
            window.location.hash = "home";
        });
        initModal();
        turnScreenOn(time);
        initTerms();
    });
}

function changePage(dir, time) {
    turnScreenOff(.35);
    setTimeout(loadPage, 400, dir, time);
}

/*
 ____   ____  _        __                       
|_  _| |_  _|(_)      |  ]                      
  \ \   / /  __   .--.| | .---.   .--.   .--.   
   \ \ / /  [  |/ /'`\' |/ /__\\/ .'`\ \( (`\]  
    \ ' /    | || \__/  || \__.,| \__. | `'.'.  
     \_/    [___]'.__.;__]'.__.' '.__.' [\__) ) 
                                                
Videos.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Videos%0A
*/

var videos = {
    1: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/monsterew-cropped.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/wrong.gif",
        title: "AWGE 01",
        desc: "AWGE 01 DESCRIPTION"
    },
    2: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-1-compressed.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-1.gif",
        title: "AWGE 02",
        desc: "AWGE 02 DESCRIPTION"
    },
    3: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-2.mov",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-2.gif",
        title: "AWGE 03",
        desc: "AWGE 03 DESCRIPTION"
    },
    4: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-concert.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-concert.gif",
        title: "AWGE 04",
        desc: "AWGE 04 DESCRIPTION",
    },
    5: {
        link: "https://embed.vevo.com?isrc=USSM21701029&autoplay=true",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/feels.gif",
        isVevo: true,
        title: "AWGE 05",
        desc: "AWGE 05 DESCRIPTION"
    },
    6: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-music.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-music.gif",
        title: "AWGE 06",
        desc: "AWGE 06 DESCRIPTION"
    },
    7: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-home.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-home.gif",
        title: "AWGE 07",
        desc: "AWGE 07 DESCRIPTION"
    },
    8: {
        link: "https://dwvo2npct47gg.cloudfront.net/videos/rocky-jail.mp4",
        gif: "https://dwvo2npct47gg.cloudfront.net/gifs/rocky-jail.gif",
        title: "AWGE 08",
        desc: "AWGE 08 DESCRIPTION"
    }
}
var currentVideo = 1;

function buildVideoPlayer() {
    var carousel = $(".videos-carousel-carousel");
    var numVids = Object.keys(videos).length;
    var centerVideo = (Math.round((numVids + 1) / 2));

    for (var i = centerVideo - 1; i > 0; i--) {
        carousel.prepend('\
        <div id="videos-' + i + '" onclick="openFullscreenVideo(' + i + ')" class="videos-carousel-item" style="transform: rotateY(' + ((i - centerVideo) * 40) + 'deg) translateZ(31vw)">\
            <img src="' + videos[i].gif + '" class="videos-carousel-video-gif" />\
        </div>\
        ');

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = "@media " + smartphones + ' {#videos-' + i + '{transform: rotateY(' + ((i - centerVideo) * 40) + 'deg) translateZ(61vw) !important;}';
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    carousel.append('\
    <div id="videos-' + centerVideo + '" onclick="openFullscreenVideo(' + centerVideo + ')" class="videos-carousel-item videos-carousel-currentVideo" style="transform: rotateY(0deg) translateZ(31vw)">\
        <img src="' + videos[centerVideo].gif + '" class="videos-carousel-video-gif" />\
    </div>\
    ');

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "@media " + smartphones + '{#videos-' + centerVideo + '{transform: rotateY(0deg) translateZ(61vw) !important;}';
    document.getElementsByTagName('head')[0].appendChild(style);

    for (var i = centerVideo + 1; i <= Object.keys(videos).length; i++) {
        carousel.append('\
        <div id="videos-' + i + '" onclick="openFullscreenVideo(' + i + ')" class="videos-carousel-item" style="transform: rotateY(' + ((i - centerVideo) * 40) + 'deg)  translateZ(31vw)">\
            <img src="' + videos[i].gif + '" class="videos-carousel-video-gif" />\
        </div>\
        ');
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = "@media " + smartphones + ' {#videos-' + i + '{transform: rotateY(' + ((i - centerVideo) * 40) + 'deg) translateZ(61vw) !important;}';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function rotateVideo(offset, speed) {
    var carousel = $(".videos-carousel-carousel");
    var numVids = Object.keys(videos).length;
    var centerVideo = (Math.round((numVids + 1) / 2));

    $($(".videos-carousel-item")[currentVideo - 1]).removeClass("videos-carousel-currentVideo");

    currentVideo += offset;
    startTextGlitch();

    if (currentVideo < 1) {
        currentVideo = 1;
        $($(".videos-carousel-item")[currentVideo - 1]).addClass("videos-carousel-currentVideo");
        var deg = (centerVideo - currentVideo) * 40;
        tryRotateCarousel(deg + 10, deg, speed);
    }
    else if (currentVideo > numVids) {
        currentVideo = numVids;
        $($(".videos-carousel-item")[currentVideo - 1]).addClass("videos-carousel-currentVideo");
        var deg = (centerVideo - currentVideo) * 40;
        tryRotateCarousel(deg - 10, deg, speed);
    }
    else {
        var deg = (centerVideo - currentVideo) * 40;
        $($(".videos-carousel-item")[currentVideo - 1]).addClass("videos-carousel-currentVideo");
        carousel.css({
            "-webkit-transform": "rotateY(" + deg + "deg)",
            "-moz-transform": "rotateY(" + deg + "deg)",
            "-o-transform": "rotateY(" + deg + "deg)",
            "transform": "rotateY(" + deg + "deg)"
        });
        carousel.css({
            "transition": "transform " + (speed * 500 / 1000) + "s"
        });
        setTimeout(function() {
            $("#videos-info-title").text(videos[currentVideo].title);
            $("#videos-info-title").attr("data-text", videos[currentVideo].title);
            $("#videos-info-description").text(videos[currentVideo].desc);
            $("#videos-info-description").attr("data-text", videos[currentVideo].desc);
            stopTextGlitch();
        }, (speed * 500));
    }
}

function tryRotateCarousel(extra, original, speed) {
    var carousel = $(".videos-carousel-carousel");

    carousel.css({
        "transition": "transform .25s"
    });
    carousel.css({
        "-webkit-transform": "rotateY(" + extra + "deg)",
        "-moz-transform": "rotateY(" + extra + "deg)",
        "-o-transform": "rotateY(" + extra + "deg)",
        "transform": "rotateY(" + extra + "deg)"
    });
    setTimeout(function() {
        carousel.css({
            "-webkit-transform": "rotateY(" + original + "deg)",
            "-moz-transform": "rotateY(" + original + "deg)",
            "-o-transform": "rotateY(" + original + "deg)",
            "transform": "rotateY(" + original + "deg)"
        });
        setTimeout(function() {
            carousel.css({
                "transition": "transform 1s"
            });
            stopTextGlitch();
        }, 250 * speed);
    }, 250 * speed);
}

function openFullscreenVideo(id, override) {
    if (id == currentVideo || override) {
        if (videos[id].isVevo) {
            $($(".videos-carousel-item")[currentVideo - 1]).addClass("animate-turn-off");
            setTimeout(function() {
                $(".videos-content").prepend('\
            <div onclick="closeFullscreenVideo()" class="videos-fullscreen-container">\
                <iframe class="videos-fullscreen-video" style="margin:10vh 10vw;border:none;width: 80% !important; height: 80% !important;" src="https://embed.vevo.com?isrc=USRV81700927&autoplay=true" allowfullscreen="true">\
                </iframe>\
            </div>\
            ');
            }, 425);
        }
        else {
            $($(".videos-carousel-item")[currentVideo - 1]).addClass("animate-turn-off");
            setTimeout(function() {
                $(".videos-content").prepend('\
            <div onclick="closeFullscreenVideo()" class="videos-fullscreen-container">\
                <video id="videos-fullscreen-video" onclick="closeFullscreenVideo()" class="videos-fullscreen-video animate-turn-on" autoplay loop poster="https://dwvo2npct47gg.cloudfront.net/gifs/video-loading.gif">\
                    <source src="' + videos[id].link + '" type="video/mp4">\
                    Your browser does not support the video tag.\
                </video>\
            </div>\
            ');
                setTimeout(function() {
                    $("#videos-fullscreen-video").get(0).play();
                }, 100);
            }, 425);
        }
    }
}

function closeFullscreenVideo() {
    $($(".videos-carousel-item")[currentVideo - 1]).removeClass("animate-turn-off");
    $(".videos-fullscreen-container").addClass("animate-turn-off");
    setTimeout(function() {
        $(".videos-fullscreen-container").remove();
    }, 425);

}

/*
  ______   __                       
.' ____ \ [  |                      
| (___ \_| | |--.   .--.   _ .--.   
 _.____`.  | .-. |/ .'`\ \[ '/'`\ \ 
| \____) | | | | || \__. | | \__/ | 
 \______.'[___]|__]'.__.'  | ;.__/  
                          [__|   
shop.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Shop
*/

var shop = {
    shirts: {
        1: {
            name: "ROLLING LOUD SHIRT",
            image: "https://dwvo2npct47gg.cloudfront.net/gifs/shirts_1.gif",
            price: "80",
            sizes: ['S', 'M', 'L', 'XL']
        },
        2: {
            name: "AWGE OR NOTHING SHIRT",
            image: "https://dwvo2npct47gg.cloudfront.net/gifs/shirts_2.gif",
            price: "80",
            sizes: ['S', 'M', 'L', 'XL']
        },
    },
    hats: {
        1: {
            name: "Blue AWGE Hat",
            image: "https://dwvo2npct47gg.cloudfront.net/gifs/hats_1.gif",
            price: "60"
        },
        2: {
            name: "Green AWGE Hat",
            image: "https://dwvo2npct47gg.cloudfront.net/gifs/hats_2.gif",
            price: "60"
        },
        3: {
            name: "Red AWGE Hat",
            image: "https://dwvo2npct47gg.cloudfront.net/gifs/hats_3.gif",
            price: "60"
        }
    }
}

var currentItem = {};

function setShopProduct(type, index) {
    if (shop[type][index] == null) {
        changeShopType("shirts");
    }

    var price = $("#shop-item-price");
    var progress = $("#shop-item-progress");
    var image = $("#shop-item-image");
    var numItems = Object.keys(shop[type]).length;

    noise.go();
    startTextGlitch();
    $("#shop-item-mobile").css("background-image", "url(" + shop[type][index].image + ")");

    setTimeout(function() {

        noise.changeImage(shop[type][index].image);

        $(progress).html("" + index + "/" + numItems).attr("data-text", "" + index + "/" + numItems);
        var localPrice = shop[type][index].price == "Sold Out" ? "Sold Out" : "$" + shop[type][index].price;
        $(price).html(localPrice).attr("data-text", localPrice).data(localPrice);
        $(image).prop("src", shop[type][index].image);

        currentItem.type = type;
        currentItem.index = index;
        resetSizes();

        setTimeout(function() {
            noise.pause();
            stopTextGlitch();
        }, 400);

    }, 400);
}

function changeShopType(type) {
    resetSizes();
    var itemsContainer = $(".shop-items-container");
    var typeContainer = $(".shop-type-container");

    $(typeContainer).children().removeClass("shop-option-active");
    $(".shop-option-" + type).addClass("shop-option-active");

    $(itemsContainer).css("animation", "turn-off" + (isSafari() ? "-safari" : "") + " 0.45s linear forwards");
    setTimeout(function() {
        setShopProduct(type, 1);
        resetSizes();
        $(itemsContainer).css("animation", "turn-on-quick" + (isSafari() ? "-safari" : "") + " 0.65s linear");
    }, 650);
}

function changeShopPage(offset) {
    var type = currentItem.type;
    var numItems = Object.keys(shop[type]).length;
    var index = parseInt(currentItem.index) + offset;

    if (index > numItems) index = 1;
    else if (index < 1) index = numItems;

    setShopProduct(type, index);
}

function closeSizes(size) {
    var wrapper = $(".shop-size-wrapper");
    var container = $(".shop-items-options-middle");

    $(wrapper).html("");
    if (size == null) {
        $(wrapper).append('<h1 onclick="openSizes()" class="shop-item-option shop-size-button">SIZE</h1>');
        currentItem.size = null;
    }
    else {
        $(wrapper).append('<h1 onclick="openSizes()" id="shop-size-final" class="shop-item-option shop-size-button">' + size + '</h1>');
        currentItem.size = size;
    }

    updateBuyButton();

    $(container).css("width", "auto");
    $(container).removeClass("shop-items-options-middle-open");
}

function openSizes() {
    var wrapper = $(".shop-size-wrapper");
    var container = $(".shop-items-options-middle");
    var type = currentItem.type;
    var index = currentItem.index;
    var numSizes = Object.keys(shop[type][index].sizes).length;

    $(wrapper).html("");
    for (var i = 0; i < numSizes; i++) {
        $(wrapper).append('<h1 onclick="closeSizes(\'' + shop[type][index].sizes[i] + '\')" class="shop-item-option shop-size-option">' + shop[type][index].sizes[i] + '</h1>');
    }
    $(container).css("width", $(container).width());

    $(container).animate({
        width: "100%"
    }, 250);

    $(container).addClass("shop-items-options-middle-open");
}

function resetSizes() {
    closeSizes();
    var wrapper = $(".shop-size-wrapper");
    var container = $(".shop-items-options-middle");

    $(wrapper).html("");
    $(container).removeClass("shop-items-options-middle-open");
    if (currentItem.type == "hats") {
        $(wrapper).css("display", "none");
        currentItem.size = "OSFA"
        updateBuyButton();
    }
    else {
        $(wrapper).css("display", "flex");
        $(wrapper).append('<h1 onclick="openSizes()" class="shop-item-option shop-size-button">SIZE</h1>');
        currentItem.size = null;
    }
}

$(document).on('click', function(e) {
    var target = $(e.target);
    var container = $(".shop-items-options-middle");
    if ($(container).hasClass("shop-items-options-middle-open")) {
        if (!$(target).hasClass("shop-items-options-middle") && !$(target).hasClass("shop-size-wrapper") && !$(target).hasClass("shop-item-option")) {
            closeSizes(currentItem.size);
        }
    }
});

function getCart() {
    try {
        return localStorage['cart'] == null ? {} : JSON.parse(localStorage['cart']);
    }
    catch (e) {
        console.log("Error Getting Cart - Emptying... " + " :: " + e)
        localStorage['cart'] = "{}";
        return JSON.parse(localStorage['cart']);
    }
}

function cleanCart() {
    var cart = getCart();

    if (Object.keys(cart).length == 0) {
        return;
    }

    for (var i = Object.keys(cart).length - 1; i >= 0; i--) {
        var id = Object.keys(cart)[i];

        var type = id.split('-')[0];
        var index = id.split('-')[1];
        var size = id.split('-')[2];

        if (type == null || index == null || size == null) {
            delete cart[id];
            continue;
        }

        var item = shop[type][index];

        if (item == null) {
            delete cart[id];
            continue;
        }
    }

    localStorage['cart'] = JSON.stringify(cart);
}

function refreshCart() {
    cleanCart();

    var container = $("#cart-container");
    $(container).html("");

    var cart = getCart();

    for (var i = 0; i < Object.keys(cart).length; i++) {
        var id = Object.keys(cart)[i];

        if (cart[id] == 0)
            continue;

        var type = id.split('-')[0];
        var index = id.split('-')[1];
        var size = id.split('-')[2];
        var item = shop[type][index];

        if (item == null) {
            cart[id] = 0;
        }

        $(container).append('<div id=' + id + ' class="cart-item"> \
                        <div class="cart-item-delete-wrapper">\
                            <h1 class="cart-item-delete" onclick="removeFromCart(\'' + id + '\')">X</h1>\
                        </div>\
                        <div class="cart-item-image" style="background-image: url(\'' + item.image + '\')"></div>\
                        <div class="cart-item-name-wrapper">\
                            <h1 class="cart-item-name">' + item.name + (size == "OSFA" ? '' : (' - SZ ' + size)) + '</h1>\
                        </div>\
                        <div class="cart-item-quantity-wrapper">\
                            <h1 class="cart-item-quantity">' + cart[id] + '</h1>\
                        </div>\
                        <div class="cart-item-price-wrapper">\
                            <h1 class="cart-item-price">$' + (parseFloat(item.price) * parseFloat(cart[id])) + '</h1>\
                        </div>\
                    </div>');
    }

    if ($(container).html() == "") {
        $(container).append('<div class="cart-items-text">YOUR CART IS EMPTY...</div>');
    }

    localStorage['cart'] = JSON.stringify(cart);
}

function addToCart() {
    if (currentItem.size == null) {
        console.log("Add to cart failed :: No Size");
        return;
    }

    var type = currentItem.type;
    var index = currentItem.index;
    var size = currentItem.size;
    var item = shop[type][index];
    var id = type + "-" + index + "-" + size;
    var cart = getCart();

    if (cart[id] == null) {
        cart[id] = 0;
    }

    cart[id]++;

    localStorage['cart'] = JSON.stringify(cart);
    refreshCart();

    openModal("cart-modal");
}

function removeFromCart(id) {
    var cart = getCart();
    delete cart[id];
    localStorage['cart'] = JSON.stringify(cart);
    refreshCart();
}

function isOutOfStock(id) {
    if (skuMatch[id] == null) {
        return false;
    }
    return !skuMatch[id].available;
}

function updateBuyButton() {
    var buyButton = $("#shop-buy-button");
    var sizeButton = $("#shop-size-button");

    $(buyButton).removeClass("shop-buy-button-disabled");
    $(sizeButton).removeClass("shop-size-button-disabled");

    $(buyButton).text("Buy");
    if (currentItem.type == null || currentItem.index == null) return;
    else if (isOutOfStock(currentItem.type + "-" + currentItem.index + "-" + currentItem.size)) {
        $(sizeButton).addClass("shop-size-button-disabled");
        $(buyButton).addClass("shop-buy-button-disabled");
        $(buyButton).text("Sold Out");

    }
    else if (currentItem.type == "shirts" && currentItem.size == null) {
        console.log(currentItem.type + "-" + currentItem.index + "-" + currentItem.size);
        var allOOS = true;
        for (var i = 0; i < shop[currentItem.type][currentItem.index].sizes.length; i++) {
            var size = shop[currentItem.type][currentItem.index].sizes[i];
            if (!isOutOfStock(currentItem.type + "-" + currentItem.index + "-" + size)) {
                allOOS = false;
                break;
            }
        }
        if (allOOS) {
            $(sizeButton).addClass("shop-size-button-disabled");
            $(buyButton).addClass("shop-buy-button-disabled");
            $(buyButton).text("Sold Out");
        }
    }
}

/*
   ______  __                    __                       _    
 .' ___  |[  |                  [  |  _                  / |_  
/ .'   \_| | |--.  .---.  .---.  | | / ]  .--.   __   _ `| |-' 
| |        | .-. |/ /__\\/ /'`\] | '' < / .'`\ \[  | | | | |   
\ `.___.'\ | | | || \__.,| \__.  | |`\ \| \__. | | \_/ |,| |,  
 `.____ .'[___]|__]'.__.''.___.'[__|  \_]'.__.'  '.__.'_/\__/  
                                                               
checkout.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Checkout%0A
*/

function openCheckoutLink() {
    var cart = getCart();
    shopCart.clearLineItems();
    for (var i = 0; i < Object.keys(cart).length; i++) {
        var id = Object.keys(cart)[i];
        console.log(skuMatch[id]);
        console.log(cart[id]);
        shopCart.createLineItemsFromVariants({
            variant: skuMatch[id],
            quantity: cart[id]
        });
    }

    window.open(shopCart.checkoutUrl, "_blank", "height=" + (screen.height * 3 / 4) + ",width=" + (screen.width / 2) + ",top=" + (screen.height / 8) + ",left=" + (screen.width / 4));
}

function getCartSubtotal() {
    var cart = getCart();
    var subtotal = 0;
    for (var i = 0; i < Object.keys(cart).length; i++) {
        var id = Object.keys(cart)[i];

        var type = id.split('-')[0];
        var index = id.split('-')[1];
        var size = id.split('-')[2];
        var item = shop[type][index];

        if (item == null) {
            cart[id] = 0;
        }

        subtotal += (parseFloat(item.price) * parseFloat(cart[id]));
    }
    return subtotal;
}





/*
 _______                                              _    
|_   __ \                                            / |_  
  | |__) |,--.    _   __  _ .--..--.  .---.  _ .--. `| |-' 
  |  ___/`'_\ :  [ \ [  ][ `.-. .-. |/ /__\\[ `.-. | | |   
 _| |_   // | |,  \ '/ /  | | | | | || \__., | | | | | |,  
|_____|  \'-;__/[\_:  /  [___||__||__]'.__.'[___||__]\__/  
                 \__.'                                     
Payment.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=Payment
*/

var checkoutShipping, checkoutEmail, orderData, shopClient, shopCart;
var items = [];
var skuMatch = {};


function initShopify() {
    shopClient = ShopifyBuy.buildClient({
        accessToken: 'db37be810ff9a5135723d0106a60494d',
        domain: 'awgeshit.myshopify.com',
        appId: '6'
    });

    shopClient.createCart().then(function(newCart) {
        shopCart = newCart;
    });

    shopClient.fetchAllCollections().then(function(collections) {
        collections.forEach(function(collection) {
            shopClient.fetchQueryProducts({ collection_id: collection.attrs.collection_id }).then(function(products) {
                products.forEach(function(product) {
                    product.variants.forEach(function(variant) {
                        console.log(variant.attrs.variant.sku);
                        skuMatch[variant.attrs.variant.sku] = variant;
                        items.push(variant);
                    });
                });
                updateBuyButton();
            });
        });
    });
}

/*
  ______         __   ____    ____               __        __          
 / ____ `.      |  ] |_   \  /   _|             |  ]      [  |         
 `'  __) |  .--.| |    |   \/   |   .--.    .--.| | .---.  | |  .--.   
 _  |__ './ /'`\' |    | |\  /| | / .'`\ \/ /'`\' |/ /__\\ | | ( (`\]  
| \____) || \__/  |   _| |_\/_| |_| \__. || \__/  || \__., | |  `'.'.  
 \______.' '.__.;__] |_____||_____|'.__.'  '.__.;__]'.__.'[___][\__) ) 
                                                                       
Models.js
http://patorjk.com/software/taag/#p=display&f=Varsity&t=3d%20Models
*/
var scene, camera, renderer, controls, object;

function initModel(container) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    var loader = new THREE.JSONLoader();

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); //0xfD35144
    //#D35144
    //scene.background = new THREE.Color(0xf1B1B1B);
    $(container).append(renderer.domElement);

    var light = new THREE.AmbientLight(0xE0E0E0); // soft white light
    scene.add(light);

    camera.position.z = 5;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;



    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

function animateModel() {
    requestAnimationFrame(animateModel);
    renderer.render(scene, camera);
    controls.update();
}

function setCameraPosition(x, y, z) {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
}

function animateModelLoading() {
    var loadText = "Loading";
    var num = ($("#model-loading").text().match(/\./g) || []).length;
    num++;
    if (num > 3) num = 1;
    for (var i = 0; i < num; i++) {
        loadText += ".";
    }
    $("#model-loading").text(loadText);
}

function showModelLoading() {
    $("#model-loading").animate({
        opacity: 1
    }, 1000);
    return setInterval(animateModelLoading, 400);
}

function hideModelLoading(id) {
    $("#model-loading").animate({
        opacity: 0
    }, 750);
    setTimeout(function() {
        clearInterval(id)
    }, 1000);
}

function loadModel(name) {
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {};

    if (object != null) scene.remove(object);
    var loadingID = showModelLoading();

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('./awge-media/models/');
    mtlLoader.load(name + '.mtl', function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('https://dwvo2npct47gg.cloudfront.net/models/');
        objLoader.load(name + '.obj', function(objectOBJ) {
            hideModelLoading(loadingID);
            setTimeout(function() {
                object = objectOBJ;
                object.position.y = 0;
                object.rotation.x = Math.PI / -2;

                switch (name) {
                    case 'shirts_1':
                        setCameraPosition(0, 12.4, 24.6);
                        controls.minDistance = 7;
                        controls.maxDistance = 50;
                        break;
                    case 'shirts_2':
                        setCameraPosition(4.3, 8.6, 27.7);
                        controls.minDistance = 7;
                        controls.maxDistance = 50;
                        break;
                    case 'hats_1':
                        setCameraPosition(23, 47.2, 144.1);
                        controls.minDistance = 50;
                        controls.maxDistance = 200;
                        break;
                    case 'hats_2':
                        setCameraPosition(42.2, 20.3, 115.7);
                        controls.minDistance = 50;
                        controls.maxDistance = 200;
                        break;
                    case 'hats_3':
                        setCameraPosition(7.1, 24.2, 122.3);
                        controls.minDistance = 50;
                        controls.maxDistance = 200;
                        break;
                    case 'revenge_green':
                        setCameraPosition(90.2, 32.9, 61.9);
                        controls.minDistance = 50;
                        controls.maxDistance = 200;
                        break;
                }

                scene.add(object);
            }, 750);
        }, onProgress, onError);
    });
}


/* Dead payment code for stripe */

/*
function displayCartCheckout(container) {
    var cart = getCart();

    for (var i = 0; i < Object.keys(cart).length; i++) {
        var id = Object.keys(cart)[i];

        if (cart[id] == 0)
            continue;

        var type = id.split('-')[0];
        var index = id.split('-')[1];
        var size = id.split('-')[2];
        var item = shop[type][index];

        if (item == null) {
            cart[id] = 0;
        }

        $(container).append('<div id=' + id + ' class="cart-item"> \
                        <div class="cart-item-image" style="background-image: url(\'' + item.image + '\')"></div>\
                        <div class="cart-item-name-wrapper">\
                            <h1 class="cart-item-name">' + item.name + (size == "OSFA" ? '' : (' - SZ ' + size)) + '</h1>\
                        </div>\
                        <div class="cart-item-quantity-wrapper">\
                            <h1 class="cart-item-quantity">' + cart[id] + '</h1>\
                        </div>\
                        <div class="cart-item-price-wrapper">\
                            <h1 class="cart-item-price">$' + (parseFloat(item.price) * parseFloat(cart[id])) + '</h1>\
                        </div>\
                    </div>');
    }
}

function setCheckoutPage(id) {
    $('#checkout-checkout').css('display', 'none');
    $('#checkout-shipping').css('display', 'none');
    $('#checkout-billing').css('display', 'none');
    $('#checkout-confirmation').css('display', 'none');

    $('#' + id).css('display', 'flex');
}





function exitCheckout() {
    if (orderData != null) {
        //SHOPIFY -- cancel open order
        $.ajax({
            method: 'POST',
            url: 'https://awge-server.herokuapp.com/cancelOrder',
            data: {
                order: orderData.orderToken
            }
        });
    }

    window.location.hash = "shop";
}

function validateShipping() {
    var numInputs = $(".shipping-input").length;
    for (var i = 0; i < numInputs; i++) {
        var obj = $("input")[i];
        if ($(obj).val() == "" && $(obj).attr("name") != "state" && $(obj).attr("name") != "address-line-2" && $(obj).attr("name") != "state") {
            notify("Fill In Shipping Info For value: " + $(obj).attr("name"));
            return false;
        }
    }
    return true;
}

function validateBilling() {
    return true;
    if (!Stripe.card.validateCardNumber($("#credit-card-number").val())) {
        notify("Invalid Card Number.");
        return false;
    }
    else if (!Stripe.card.validateCVC($("#credit-card-cvc").val())) {
        notify("Invalid CVC.");
        return false;
    }
    else if (!Stripe.card.validateExpiry($("#credit-card-expiry").val())) {
        notify("Invalid Expiry.");
        return false;
    }
    else if ($("#credit-card-name").val() == "") {
        notify("Fill in billing info for value: " + $("#credit-card-name").attr('id'));
        return false;
    }
    else {
        return true;
    }
}




function completeBilling() {
    if (!validateShipping() || !validateBilling()) {
        return false;
    }
    else {
        $("#continue-to-confirmation").css("cursor", "context-menu");
        $("#continue-to-confirmation").css("color", "#afafaf");

        Stripe.card.createToken({
            number: $('#credit-card-number').val(),
            cvc: $('#credit-card-cvc').val(),
            exp: $('#credit-card-expiry').val(),
            name: $("#credit-card-name").val()
        }, createOrder);

        return true;
    }
}

function createOrder(status, response) {
    var items = [];
    var cart = getCart();
    var send = {
        currency: 'usd',
        email: $("#email").val()
    };

    //items
    for (var i = 0; i < Object.keys(cart).length; i++) {
        var id = Object.keys(cart)[i];
        items[i] = {
            type: 'sku',
            parent: id,
            quantity: cart[id]
        };
    }

    //shipping
    shipping = {
        name: $("#first-name").val() + " " + $("#last-name").val(),
        address: {
            line1: $("#address-line-1").val(),
            city: $("#city").val()
        }
    };

    if ($("#address-line-2").val() != "") {
        shipping.address.line2 = $("#address-line-2").val();
    }

    if ($("#zipcode").val() != "") {
        shipping.address.postal_code = $("#zipcode").val();
    }

    if ($("#state").val() != "") {
        shipping.address.state = $("#state").val();
    }

    send.items = items;
    send.shipping = shipping;
    checkoutEmail = send.email;

    if (response.error) {
        notify(response.error.message);
        $("#place-order").css("cursor", "pointer");
        $("#place-order").css("color", "white");
    }
    else {
        var token = response.id;
        $.ajax({
            method: 'GET',
            url: 'https://awge-server.herokuapp.com/createOrder?data=' + encodeURIComponent(JSON.stringify(send)) + '&payToken=' + encodeURIComponent(token)
        }).done(function(data) {
            $("#continue-to-confirmation").css("cursor", "pointer");
            $("#continue-to-confirmation").css("color", "white");

            try {
                data = JSON.parse(data);
            }
            catch (err) {
                notify("Bad Server Response");
                return;
            }

            if (data.error == "true") {
                notify(data.message);
                $("#place-order").css("cursor", "pointer");
                $("#place-order").css("color", "white");
                orderData = null;
                return;
            }

            orderData = data;

            $("#confirmation-subtotal").html("$" + getCartSubtotal().toFixed(2));
            $("#confirmation-shipping").html("$" + (orderData.shipping / 100).toFixed(2));
            $("#confirmation-tax").html("$" + (orderData.tax / 100).toFixed(2));
            $("#confirmation-total").html("$" + (orderData.total / 100).toFixed(2));
            setCheckoutPage('checkout-confirmation');
        });
    }
}

function chargeOrder() {
    $.ajax({
        method: 'GET',
        url: 'https://awge-server.herokuapp.com/chargeOrder?order=' + encodeURIComponent(orderData.orderToken) + '&pay=' + encodeURIComponent(orderData.payToken) + '&email=' + encodeURIComponent(checkoutEmail)
    }).done(function(data) {
        $("#place-order").css("cursor", "pointer");
        $("#place-order").css("color", "white");

        try {
            data = JSON.parse(data);
        }
        catch (err) {
            notify("Bad Server Response");
            return;
        }

        if (data.error == "true") {
            notify(data.message);
            return;
        }

        orderData.num = data.num;

        $(".checkout-container").load("./pages/message.html", function() {
            messageLoad();
        });

    });
}

*/
