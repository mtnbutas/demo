window.Event = new Vue();

class Errors {
	constructor() {
		this.errors = {};
	}
	set(errors) {
		this.errors = errors;
	}
	has(field) {
		return this.errors.hasOwnProperty(field);
	}
	any() {
		return Object.keys(this.errors).length > 0;
	}
	get(field) {
		if(this.errors[field]) {
			return this.errors[field][0]
		}
	}
	clear(field) {
		delete this.errors[field];
	}
}

class Form {
	constructor(data) {
		this.originalData = data;
		this.errors = new Errors();
		for (let field in data) {
            this[field] = data[field];
        }
	}
	reset() {
		for (let field in this.originalData) {
			this[field] = '';
		}
	}
	data() {
		let data = Object.assign({}, this);
		delete data.originalData;
		delete data.errors;
		return data
	}
	submit(method, url) {
		axios({
		  method: method,
		  url: url,
		  data: this.data()
		})
		.then(response => this.callback(response.data))
		.catch(response => console.log('submit error: '+ response))
	}
	callback(data) {
		if (data.errors) {
			this.errors.set(data.errors);
		} else {
			Event.$emit("submit", data);
			this.reset();
		}
	}
}

/* Vue Components */
Vue.component('post', {
	props: { post: {'required': true }},
	template: `
		<div class="tweet-wrapper">
			<div class="poster-pic-wrapper">
				<div class="poster-pic"></div>
			</div>
			<div class="post-info">
				<div class="poster-name">( •᷄⌓•᷅ ) </div>
‏				<div class="poster-username"> @asfgggg · </div>
				<div class="time-posted"> 13m </div>
				<div class="post-content" v-text="post.fields.content"></div>
			</div>
			<div class="post-settings" v-on:click="deletePost()">x</div>
			<div class="post-options">
				<button class="reply"><div></div><span>123K</span></button>
				<button class="retweet"><div></div><span>123K</span></button>
				<button class="favorite"><div></div><span>123K</span></button>
			</div>
		</div>
		`,
	methods: {
        deletePost() {
            axios.delete('/posts/', {
                data: { pk: this.post.pk }
            })
			.then(response => Event.$emit("delete", this.post))
			.catch(response => console.log('error: ' + response))
        }
    }
});

Vue.component('post-list', {
	data() {
		return {
			posts: []
		}
	},
	mounted() {
		axios.get('/posts/')
		.then(response => this.posts = response.data)
		.catch(response => console.log('error: '+ response))
	},
	created() {
		Event.$on("delete", (post) => {
			let index = this.posts.indexOf(post);
			this.posts.splice(index, 1);
		});
		Event.$on("submit", (data) => this.posts.push(data[0]) );
	},
});

/* Vue App */
app = new Vue({
	delimiters: ['[[',']]'],
	el: '#app',
	data: {
		form: new Form({
			title: '',
			content: ''
		})
	},
	methods: {
		addPost() {
			this.form.submit('POST', '/posts/');
			document.querySelector('textarea').value = "";
			document.querySelector('textarea').style.height = '1.2em';
			document.querySelector('textarea').style.minHeight = '1.2em';
			document.querySelector('button[type=submit]').style.display = 'none';
			document.querySelector('button[type=submit]').disabled = true;
		}
	}
});
