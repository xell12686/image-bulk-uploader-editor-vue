<template>
	<div class="uploader">
        
        <div class="container">
            
            <div class="uploader--heading">
                <span class="uploader--title">Upload your images</span>
                <span>Not sure of something?
                    <span @click="changeStep('instructions')" class="text-primary d-inline-block text-pointer">
                        See the instructions again
                    </span>
                </span>
            </div>

        </div>

	</div>
</template>

<script>
import eventBus from './eventBus';
// import { PlusCircleIcon } from 'vue-feather-icons';

export default {
    components: {
        // PlusCircleIcon
    },
    data() {
        return {
            uploadedFiles: []
        }
    },
    methods: {
		changeStep(target) {
			eventBus.$emit("change-step", target);
		},
    }
};
</script>

<style lang="scss" scoped>

    .uploader {
        position: relative;
        margin: 0 -15px;
        transition: all .5s ease;
        &.has-files {
            @media (min-width: 768px) {
                margin-top: -70px;
            }
        }
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
                width: calc(100vw - 0px);
            }
            @media (max-width: 765px) {
                top: calc(0% + 300px);
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

    }

</style>