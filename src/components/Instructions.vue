<template>
	<div class="instructions p-3 mb-5">
		<div class="container">
			<div class="row">
				<div class="col-12 col-text" :class="checkIfStepHasImage ? 'col-md-6' : ''" >
					<div class="wrap d-flex flex-column">
						<span class="h3 mb-4">{{ steps[step].title }}</span>
						<p>{{ steps[step].text }}</p>

						<div class="row">
							<div v-if="steps[step].dos" class="col-12 col-sm-6">
								<span class="h4">Do's</span>
								<ul class="dos list-unstyled">
									<li v-for="(item, index) in steps[step].dos" :key="index" >
										<img :src="check" alt="icon">
										{{ item }}
									</li>
								</ul>
							</div>
							<div v-if="steps[step].donts" class="col-12 col-sm-6">
								<span class="h4">Dont's</span>
								<ul class="donts list-unstyled">
									<li v-for="(item, index) in steps[step] .donts" :key="index" >
										<img :src="cross" alt="icon">
										{{ item }}
									</li>
								</ul>
							</div>
							<div
								v-if="steps[step].donts"
								class="col-12 col-sm-6"
							></div>
						</div>

						<div class="nav d-flex mt-auto pt-4">
							<button class="btn btn-alt btn-prev" @click="prev">
								<chevron-left-icon />
								Back
							</button>
							<button class="btn btn-next" @click="next">
								Next
								<chevron-right-icon />
							</button>
						</div>

						<ul class="dots">
							<li
								v-for="(item, index) in steps"
								:key="index"
								:class="[index === step ? 'active' : '']"
							></li>
						</ul>
					</div>
				</div>

				<div v-if="checkIfStepHasImage" class="col-12 col-md-6 col-img">
					<div class="wrap h-100 w-100 d-flex">
						<img
							:src="this.$appImgsPath + steps[step].img"
							alt="step img"
							class="img-fluid"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import eventBus from "./eventBus";
import { ChevronLeftIcon, ChevronRightIcon } from "vue-feather-icons";
import instructionsData from "@/json/instructions.json";

export default {
	components: {
		ChevronRightIcon,
		ChevronLeftIcon
	},
	data() {
		return {
			step: 0,
			steps: instructionsData,
			logo: "logo.svg",
			check: this.$appImgsPath + 'check.png',
			cross: this.$appImgsPath + 'cross-red.png'
		};
	},
	methods: {
		prev() {
			if (this.step > 0) {
				this.step--;
			} else if (this.step <= 0) {
				this.changeStep('upload');
			}
		},
		next() {
			if (this.step < 3) {
				this.step++;
			} else if (this.step >= 3) {
				this.changeStep('upload');
			}
		},
		changeStep() {
			let newRootStep = "upload";
			eventBus.$emit("change-step", newRootStep);
		},
	},
	computed: {
		checkIfStepHasImage() {
			if (
				this.steps[this.step].img &&
				this.steps[this.step].img !== null
			) {
				return true;
			}
			return false;
		},
	},
	mounted() {
		// console.log(this.steps);
	},
};
</script>

<style lang="scss" scoped>
$minHeight: 430px;

.instructions {
	background-color: white;
	margin: 0 auto;
	max-width: 800px;
	border-radius: 10px;
}

.col-text {
	padding: 35px 30px 15px 35px;
	.wrap {
		min-height: $minHeight;
	}
	.h3 {
		font-size: 2.3rem;
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
}
.col-img {
	.wrap {
		background-color: $grey;
		min-height: $minHeight;
	}
	img {
		max-width: 120px;
		width: 100%;
		margin: auto;
	}
}

.dots {
	margin: 20px 0 0 0;
	padding: 0;
	li {
		width: 10px;
		height: 10px;
		display: inline-block;
		background: $grey-1;
		border-radius: 50%;
		margin: 0 10px 0 0;
		&.active {
			background-color: $primary;
		}
	}
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
@media (max-width: 765px) {
	.col-text {
		padding: 15px;
	}
	.col-img,
	.btn-prev {
		display: none;
	}
}
</style>