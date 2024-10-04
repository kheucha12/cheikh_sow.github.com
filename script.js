
$(document).ready(function () {
  var input = $('.field').find('input, textarea');
  input.keyup(function () {
    inputTest(this);
  });
});

function inputTest(that) {
  var field = $(that).closest('.field');
  var form = $(that).closest('form, .form');
  var length = $.trim($(that).val()).length;

  //  FILLED
  if (length > 0) field.addClass('filled');else field.removeClass('filled');

  //  VALIDATED
  if (length >= 4) {
    field.addClass('validated');
    form.addClass('validated');
  } else {
    field.removeClass('validated');
    form.removeClass('validated');
  }
}
var Timer = {
  length: null,
  time: null,
  selector: null,
  interval: null,
  callback: null,

  //  RUN
  run: function (selector, callback, length) {
    Timer.length = length;
    Timer.time = Timer.length;
    Timer.selector = selector;
    Timer.callback = callback;
    $(Timer.selector).text(Timer.length);
    Timer.interval = setInterval(Timer.count, 1000);
  },

  //  COUNT
  count: function () {
    Timer.time = Timer.time - 1;
    $(Timer.selector).text(Timer.time);
    if (Timer.time <= 0) {
      if (typeof Timer.callback === 'function' && Timer.callback) Timer.callback();
      Timer.reset();
    }
  },

  //  RESET
  reset: function () {
    clearInterval(Timer.interval);
    Timer.length = null;
    Timer.time = null;
    Timer.selector = null;
    Timer.interval = null;
    Timer.callback = null;
  }
};
var Identity = {
  duration: 1400,
  delay: 500,
  iteration: 0,
  processing: false,
  enough: false,
  interval: null,
  callback: null,
  status: 'loading',
  id: '#identity',
  selector: '#identity div',
  classes: 'working rest robot',

  //  WORK
  work: function () {
    if (Identity.status != 'loading') Identity.status = 'working';
    Identity.wait(function () {
      $(Identity.id).addClass('working');
    });
  },

  //  ROBOT
  robot: function () {
    Identity.status = 'robot';
    Identity.wait(function () {
      $(Identity.id).addClass('robot');
    });
  },

  //  REST
  rest: function () {
    Identity.abort();
    Identity.status = 'rest';
    setTimeout(function () {
      Identity.abort();
      $(Identity.id).addClass('rest');
    }, Identity.delay);
  },

  //  WAIT
  wait: function (call) {
    if (Identity.processing != true) {
      Identity.abort();
      Identity.processing = true;

      setTimeout(function () {
        if (typeof call === 'function' && call) call();
        Identity.waiting();
        Identity.interval = setInterval(Identity.waiting, Identity.duration);
      }, Identity.delay);
    }
  },

  //  WAITING
  waiting: function () {
    if (Identity.enough != true) {
      ++Identity.iteration;
      return;
    }

    Identity.stopping();
  },

  //  STOP
  stop: function (callback) {
    setTimeout(function () {
      if (Identity.processing == true) {
        Identity.enough = true;
        Identity.callback = callback;

        $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
      }
    }, Identity.delay);
  },

  //  STOPPING
  stopping: function () {
    clearInterval(Identity.interval);
    Identity.rest();

    if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
    Identity.reset();
  },

  //  ABORT
  abort: function () {
    if (Identity.status == 'robot') $(Identity.id).removeClass('robot');else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');else $(Identity.id).removeClass(Identity.classes);
  },

  //  RESET
  reset: function () {
    Identity.iteration = 0;
    Identity.processing = false;
    Identity.enough = false;
    Identity.interval = null;
    Identity.callback = null;

    $(Identity.selector).removeAttr('style');
  }
};
var Stars = {
  canvas: null,
  context: null,
  circleArray: [],
  colorArray: ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'],

  mouseDistance: 50,
  radius: .5,
  maxRadius: 1.5,

  //  MOUSE
  mouse: {
    x: undefined,
    y: undefined,
    down: false,
    move: false
  },

  //  INIT
  init: function () {
    this.canvas = document.getElementById('stars');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = 'block';
    this.context = this.canvas.getContext('2d');

    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('resize', this.resize);

    this.prepare();
    this.animate();
  },

  //  CIRCLE
  Circle: function (x, y, dx, dy, radius, fill) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = this.radius;

    this.draw = function () {
      Stars.context.beginPath();
      Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      Stars.context.fillStyle = fill;
      Stars.context.fill();
    };

    this.update = function () {
      if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
      if (this.y + this.radius > Stars.canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;

      //  INTERACTIVITY
      if (Stars.mouse.x - this.x < Stars.mouseDistance && Stars.mouse.x - this.x > -Stars.mouseDistance && Stars.mouse.y - this.y < Stars.mouseDistance && Stars.mouse.y - this.y > -Stars.mouseDistance) {
        if (this.radius < Stars.maxRadius) this.radius += 1;
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw();
    };
  },

  //  PREPARE
  prepare: function () {
    this.circleArray = [];

    for (var i = 0; i < 1200; i++) {
      var radius = Stars.radius;
      var x = Math.random() * (this.canvas.width - radius * 2) + radius;
      var y = Math.random() * (this.canvas.height - radius * 2) + radius;
      var dx = (Math.random() - 0.5) * 1.5;
      var dy = (Math.random() - 1) * 1.5;
      var fill = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

      this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
    }
  },

  //  ANIMATE
  animate: function () {
    requestAnimationFrame(Stars.animate);
    Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);

    for (var i = 0; i < Stars.circleArray.length; i++) {
      var circle = Stars.circleArray[i];
      circle.update();
    }
  },

  //  MOUSE MOVE
  mouseMove: function (event) {
    Stars.mouse.x = event.x;
    Stars.mouse.y = event.y;
  },

  //  RESIZE
  resize: function () {
    Stars.canvas.width = window.innerWidth;
    Stars.canvas.height = window.innerHeight;
  }
};
var renderer, scene, camera, ww, wh, particles;

ww = window.innerWidth, wh = window.innerHeight;

var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;
speed = 10;
isMouseDown = false;

var getImageData = function (image) {

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);

	return ctx.getImageData(0, 0, image.width, image.height);
};

function getPixel(imagedata, x, y) {
	var position = (x + imagedata.width * y) * 4,
	    data = imagedata.data;
	return { r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3] };
}

var drawTheMap = function () {

	var geometry = new THREE.Geometry();
	var material = new THREE.PointCloudMaterial();
	material.vertexColors = true;
	material.transparent = true;
	for (var y = 0, y2 = imagedata.height; y < y2; y += 1) {
		for (var x = 0, x2 = imagedata.width; x < x2; x += 1) {
			if (imagedata.data[x * 4 + y * 4 * imagedata.width] > 0) {

				var vertex = new THREE.Vector3();
				vertex.x = x - imagedata.width / 2 + (500 - 440 * .5);
				vertex.y = -y + imagedata.height / 2;
				vertex.z = -Math.random() * 500;

				vertex.speed = Math.random() / speed + 0.015;

				var pixelColor = getPixel(imagedata, x, y);
				var color = "rgb(" + pixelColor.r + ", " + pixelColor.g + ", " + pixelColor.b + ")";
				geometry.colors.push(new THREE.Color(color));
				geometry.vertices.push(vertex);
			}
		}
	}
	particles = new THREE.Points(geometry, material);

	scene.add(particles);

	requestAnimationFrame(render);
};

var init = function () {
	renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("yahia"),
		antialias: true,
		alpha: true
	});
	renderer.setSize(ww, wh);

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000);
	camera.position.set(0, -20, 4);
	camera.lookAt(centerVector);
	scene.add(camera);
	camera.zoom = 1;
	camera.updateProjectionMatrix();

	imagedata = getImageData(image);
	drawTheMap();

	window.addEventListener('mousemove', onMousemove, false);
	window.addEventListener('mousedown', onMousedown, false);
	window.addEventListener('mouseup', onMouseup, false);
	window.addEventListener('resize', onResize, false);
};
var onResize = function () {
	ww = window.innerWidth;
	wh = window.innerHeight;
	renderer.setSize(ww, wh);
	camera.left = ww / -2;
	camera.right = ww / 2;
	camera.top = wh / 2;
	camera.bottom = wh / -2;
	camera.updateProjectionMatrix();
};

var onMouseup = function () {
	isMouseDown = false;
};
var onMousedown = function (e) {
	isMouseDown = true;
	lastMousePos = { x: e.clientX, y: e.clientY };
};
var onMousemove = function (e) {
	if (isMouseDown) {
		camera.position.x += (e.clientX - lastMousePos.x) / 100;
		camera.position.y -= (e.clientY - lastMousePos.y) / 100;
		camera.lookAt(centerVector);
		lastMousePos = { x: e.clientX, y: e.clientY };
	}
};

var render = function (a) {

	requestAnimationFrame(render);

	particles.geometry.verticesNeedUpdate = true;
	if (!isMouseDown) {
		camera.position.x += (0 - camera.position.x) * 0.06;
		camera.position.y += (0 - camera.position.y) * 0.06;
		camera.lookAt(centerVector);
	}

	renderer.render(scene, camera);
};

var imgData = ' data:image/jpeg;base64,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';

var image = document.createElement("img");
image.src = imgData;
var Submit = {

  //  DATA
  data: function (template, fields) {
    var data = {};
    for (i = 0; i < fields.length; i++) {
      var field = $(fields[i]);
      var name = field.attr('name');
      var value = field.val().replace(/(?:\r\n|\r|\n)/g, '<br>');
      data[name] = value;
    }

    return data;
  },

  //  PUSH
  push: function (form) {
    var template = $('.template[data-template=' + form + ']');
    var fields = template.find('.field input, .field textarea');

    //  WAITING
    Submit.view('[data-status=waiting]', template);

    //  AJAX
    $.ajax({
      type: 'POST',
      url: 'includes/php/' + form + '.php',
      data: { dd: JSON.stringify(Submit.data(template, fields)) },
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        Submit.callback('error', form, template, fields);
      },
      success: function (data) {
        Submit.callback('success', form, template, fields);
      }
    });
  },

  //  CALLBACK
  callback: function (status, form, template, fields) {
    setTimeout(function () {

      //  SUCCESS
      if (status == 'success') {
        template.find('.form .status').removeClass('current');
        fields.closest('.field').fadeOut(700);
        fields.closest('.form').find('.submit').fadeOut(700);
        Identity.stop();

        if (form == 'secret') secretAvailability = false;else if (form == 'opinion') opinionAvailability = false;

        setTimeout(function () {
          fields.closest('.form').find('.submit').remove();
          fields.closest('.field').remove();
          template.find('.form .status[data-status=success]').addClass('current');
        }, 750);
      }

      //  ERROR
      else {
          Submit.view('[data-status=error]', template);
          setTimeout(function () {
            Submit.view(':not([data-status])', template);
          }, 6000);
        }
    }, 4000);
  },

  //	VIEW
  view: function (selector, template) {
    template.find('.form .status').removeClass('current');
    template.find('.form .status' + selector).addClass('current');
  },

  //	LISTEN
  listen: function (selector) {
    $(selector).on('click', function (e) {
      if ($(this).closest('.form').hasClass('validated')) {
        var form = $(this).attr('data-form');
        Submit.push(form);
      }

      e.preventDefault();
    });
  }
};
var Router = {
	wrapper: [],
	location: null,

	//	ROUTE
	route: function (location, callback) {
		Identity.work();
		Router.location = Router.processLocation(location);

		//	ROUTES
		Router.routes(callback);
	},

	//	PROCESS LOCATION
	processLocation: function (location) {
		if (location === undefined) location = window.location.hash;

		return location.replace('#', '');
	},

	//	CALLBACK
	callback: function (callback) {
		setTimeout(function () {
			Identity.stop();
      Router.updateWrapper();
      Router.updateTemplate(Router.wrapper[0]);
      window.location.hash = Router.location;
      Router.location = null;

      //  CALLBACKS
      Router.callbacks(Router.wrapper[0]);
      if (typeof callback === 'function' && callback) callback();
		}, 200);
	},

	//	UPDATE TEMPLATE
	updateTemplate: function (template) {
		var templates = $('.template');
		var current = $('.template[data-template=' + template + ']');

		templates.removeClass('current');
		setTimeout(function () {
			templates.hide();
			current.show().addClass('current');
		}, 1120);
	},

	//	UPDATE WRAPPER
	updateWrapper: function (push, pull) {
		if (push) Router.push(push);
		if (pull) Router.pull(pull);

		var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
		$('.wrapper').attr('class', 'wrapper ' + wrapper);
	},

	//	PUSH
	push: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
		}
	},

	//	PULL
	pull: function (items) {
		items = items.split(' ');

		for (i = 0; i < items.length; i++) {
			if (Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
		}
	},

	//	LISTEN
	listen: function () {
		$('.wrapper').on('click', '.router', function (e) {
			Router.route($(this).attr('href'), window[$(this).attr('data-callback')]);
			e.preventDefault();
		});

		window.addEventListener('popstate', function (e) {
			Router.route(undefined);
		});
	}
};
Router.routes = function (callback) {
  Router.wrapper = [];
  var location = Router.location.split('/').filter(Boolean);

  //  HOME
  Router.push('home');

  //  CALLBACK
  Router.callback(callback);
};
Router.callbacks = function (wrapper) {
  if (wrapper == 'secret') secret();else if (wrapper == 'opinion') opinion();else if (wrapper == 'bucketAll') bucketAll();else if (wrapper == 'notFound') notFound();
};
var secretAvailability = true;
function secret() {
  if (secretAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=secret] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
var opinionAvailability = true;
function opinion() {
  if (opinionAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=opinion] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
function bucketAll() {
  var list = $('.template[data-template=bucketAll] .bucketList');
  var link = list.find('li.archived a');

  //  LISTEN
  link.hover(function () {
    list.addClass('hover');
  }, function () {
    list.removeClass('hover');
  });
}
function notFound() {
  setTimeout(function () {
    Timer.run('.template[data-template=notFound] time', function () {
      Router.route('#');
    }, 5);
  }, Identity.duration * 1.25);
}

function notFoundCallback() {
  Timer.reset();
}
var md = new MobileDetect(window.navigator.userAgent);

$(document).ready(function () {
  Identity.work();
  $('.template main').mCustomScrollbar({
    theme: 'dark'
  });
});

function loadProject() {
  Router.route(undefined, function () {

    //  CALLBACK
    Router.listen();
    Submit.listen('.submit');
    if (!md.mobile()) {
      Stars.init();
      init();
    }
    setTimeout(function () {
      $('#signature').removeClass('loading');
    }, Identity.delay * 1.5);
  });
};

loadProject();