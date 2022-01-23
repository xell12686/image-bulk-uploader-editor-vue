<template>
	<div class="review p-3">

		<div class="container">

			<div class="review--heading">
				<span @click="changeStep('upload')" class="text-primary d-inline-block text-pointer mb-4">
					<img :src="arrowLeft" alt="icon" class="d-inline-block mr-2" /> Back to Upload
				</span>
				<span class="review--title">Review your photos</span>
			</div>

			<div class="card-wrap">

				<div class="row m-0">

					<div class="col-12 col-lg-7 col-text ">

						<div class="wrap d-flex flex-column">

							<span class="h3 mb-3">{{ review.title }}</span>
							<p class="mb-4">{{ review.copy }}</p>

							<div class="row">
								<div v-if="review.dos" class="col-12">
									<span class="h4">Do's</span>
									<ul class="dos list-unstyled">
										<li v-for="(item, index) in review.dos" :key="index">
											<img :src="check" alt="icon" />
											{{ item }}
										</li>
									</ul>
								</div>
								<div v-if="review.donts" class="col-12">
									<span class="h4">Dont's</span>
									<ul class="donts list-unstyled">
										<li v-for="(item, index) in review.donts" :key="index">
											<img :src="cross" alt="icon" />
											{{ item }}
										</li>
									</ul>
								</div>
							</div>

						</div>
					</div>

					<div class="col-12 col-lg-5 col-img bg-dark text-light">

						<div class="wrap h-100 w-100 d-flex flex-column">

							<div v-if="this.images.length">

								<ReviewEditor :imgSrc="currentImage" :currentIndex="currentIndex" :images="images" />

								<div class="nav d-flex w-100 justify-content-between mt-auto mb-3 py-4">
									<button class="btn btn-prev" 
										:disabled="this.currentIndex <= 0" 
										@click="prev">
										<chevron-left-icon />
									</button>
									<div class="indicator">
										{{ this.currentIndex + 1 }}  of {{ this.images.length }}
									</div>
									<button class="btn btn-next" 
										:disabled="this.currentIndex === (this.images.length - 1)" 
										@click="next">
										<chevron-right-icon />
									</button>
								</div>

								<div class="confirm-wrap">
									<button class="btn confirm w-100" 
										v-if="this.currentIndex === (this.images.length - 1)"  
										@click="submitToServer">
										Comfirm Uploads
										<chevron-right-icon />
									</button>
								</div>

							</div>

							<h3 v-else>No images uploaded yet</h3>
						
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import eventBus from "./eventBus";
import ReviewEditor from "./ReviewEditor";
import { ChevronLeftIcon, ChevronRightIcon } from "vue-feather-icons";
import review from "@/json/review.json";

export default {
	components: {
		ChevronRightIcon,
		ChevronLeftIcon,
		ReviewEditor,
	},
	props: ['uploadedFiles'],
	data() {
		return {
			review: review,
			check: this.$appImgsPath + "check.png",
			cross: this.$appImgsPath + "cross-red.png",
			arrowLeft: this.$appImgsPath + "arrow-red-left.svg",
			images: [], 
			currentIndex: 0,
			currentImage: undefined,
		};
	},
	methods: {
		prev() {
			if (this.currentIndex > 0) {
				this.currentIndex--;
			}
		},
		next() {
			if (this.currentIndex <= this.images.length) {
				this.currentIndex++;
			} 
		},
		changeStep(target) {
			eventBus.$emit("change-step", target);
		},
		submitToServer() {
			console.log('Uploads Confirmed...');
            //log images array to be submitted
            console.log(this.images);
            //clear localStorage item
            localStorage.removeItem("thiscoveryUploadedFiles");
        },
	},
	mounted() {
		this.images = this.uploadedFiles;
		this.currentImage = this.images[this.currentIndex];
		// console.log('review mounted...');
		// console.log(this.images);
		// console.log('current item:' + this.currentIndex);
	},
};
</script>

<style lang="scss" scoped>

$minHeight: 430px;

.review {

	position: relative;
	margin: 0 -20px;
	&:after {
		background-color: $grey;
		content: "";
		display: block;
		position: absolute;
		width: calc(100vw - 0px);
		height: calc(80vh + 0px);
		top: calc(100% + 90px);
		left: 50%;
		transform: translateX(-50%);
		z-index: -1;
		@media (min-width: 1200px) {
			width: calc(100vw - 15px);
		}
	}
	&--heading {
		font-size: 18px;
		margin-top: 0;
		margin-bottom: 30px;
		span {
			display: block;
		}
		@media (max-width: 540px) {
			max-width: 300px;
			margin-top: 0;
		}
	}

	&--title {
		font-weight: 600;
		font-size: 36px;
		@media (max-width: 540px) {
			line-height: 1.2;
		}
	}

	&--field {
		border: 2px dashed $secondary;
		padding: 20px;
		border-radius: 5px;
		margin: 35px;
	}

	&--editor {
		min-height: 360px;
	}
	@media (max-width: 765px) {
        margin: 0 -30px;
		&:after {
			top: calc(10% + 130px);
		}
    }
	@media (min-width: 768px) {
		margin-top: -70px;
	}

}

.card-wrap {
	background-color: white;
	margin: 0 auto;
	border-radius: 10px;
	overflow: hidden;
}

.col-text {
	padding: 35px 30px 30px 35px;
	background-color: white;
	.wrap {
		min-height: $minHeight;
	}
	.h3 {
		margin-bottom: 1rem;
	}
	.h4 {
		font-size: 1.7rem;
	}
	.nav {
		gap: 12px;
		.btn:hover {
			@extend .btn-alt;
		}
	}
	@media (max-width: 765px) {
		padding: 30px 20px;
	}
}

.col-img {
	background-color: $dark-1;
	padding: 40px;
	.img-wrap {

	}
	@media (max-width: 765px) {
		padding: 30px;
	}
}

.confirm-wrap {
	min-height: 50px;
}

.dos,
.donts {
	li {
		position: relative;
		padding: 10px 10px 10px 38px;
		margin-bottom: 0;
		line-height: 1.1em;
		img {
			position: absolute;
			left: 0;
			top: 10px;
			width: 30px;
			height: 30px;
		}
	}
}
.nav {
	border-top: 1px solid $grey-1;
	.btn {
		width: 40px;
		height: 40px;
		padding: 0;
		svg {
			margin: 0 auto;
		}
		&:disabled {
			border: 2px solid $grey-1;
			background-color: transparent;
			svg {
				filter: grayscale(100%);
			}
		}
	}
}

</style>