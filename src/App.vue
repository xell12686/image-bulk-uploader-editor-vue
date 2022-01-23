<template>
	<div class="app-root">

        <div v-if="currentStep === 'upload'">
            <Uploader />
            <UploadField :initialFiles="uploadedFiles" />
        </div>
		<Instructions v-if="currentStep === 'instructions'" />
		<Review 
			v-if="currentStep === 'review'" 
			:uploadedFiles="uploadedFiles"
			/>

	</div>
</template>

<script>
import eventBus from "@/components/eventBus";
import Uploader from "@/components/Uploader";
import Instructions from "@/components/Instructions";
import Review from "@/components/Review";
import UploadField from "@/components/UploadField";

export default {
	data() {
		return {
			currentStep: "instructions",
			uploadedFiles: [],
		};
	},
	components: {
		Uploader,
        UploadField,
		Instructions,
        Review
	},
	mounted() {
		eventBus.$on("change-step", (stepVal) => {
			this.currentStep = stepVal;
		});
		eventBus.$on("update-uploaded-files", (filesPayload) => {
			this.uploadedFiles = filesPayload;
			localStorage.setItem('thiscoveryUploadedFiles', JSON.stringify(filesPayload));
			console.log('event bus update-uploaded-files');
		});
		eventBus.$on("update-single-file", (fileIndex, fileData) => {
			this.uploadedFiles[fileIndex] = fileData;
			localStorage.setItem('thiscoveryUploadedFiles', JSON.stringify(this.uploadedFiles));
			console.log('event bus update-single-file');
		});
		
		//check for local stored images
		var storedImages = JSON.parse(localStorage.getItem("thiscoveryUploadedFiles"));
		if (storedImages) {
			console.log(storedImages);
			this.uploadedFiles = storedImages;
		} else {
			console.log('no stored images');
		}
	},
	methods: {},
	created() {},
};
</script>

<style lang="scss" scoped>
.app-root {
	margin: 60px -15px 0;
	@media (max-width: 540px) {
		margin: 0 0 0;
	}
}
</style>