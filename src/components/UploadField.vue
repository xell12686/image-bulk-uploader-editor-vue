<template>
    <div id="uploadFieldWrap">
        <div class="container">
            <DokaImageEditorModal
                v-bind="editorProps"
                v-if="modalVisible"
                :src="modalSrc"
                @doka:hide="modalVisible = false"
                @doka:show="handleModalShow()"
                @doka:close="handleModalClose()"
                @doka:load="handleModalLoad($event)"
                @doka:process="handleModalProcess($event)"
            />

            <file-pond
                id="uploadField"
                ref="pond"
                accepted-file-types="image/jpeg, image/png"
                allow-multiple="true"
                :imageEditor="myEditor"
                :files="filesToLoad"
                @init="handleFilePondInit"
                @addfile="handleFilePondAddFile"
                @removefile="handleFilePondRemoveFile"
                imagePreviewHeight="300"
                labelIdle="Drag and drop files to upload or click here to browse"
                dropOnPage="true"
            >
            </file-pond>

            <button class="btn go-to-review" @click="reviewPhotos">
                Review Photos <chevron-right-icon />
            </button>
        </div>
    </div>
</template>

<script>
import eventBus from "./eventBus";
import { ChevronRightIcon } from "vue-feather-icons";
// import sampleImages from "@/json/sample-images.json";

// Import Vue FilePond
import vueFilePond from "vue-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageEditor from "filepond-plugin-image-editor";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";

// Import vue-doka
import { DokaImageEditorModal } from "vue-doka";

// Import doka
import {
    // editor
    createDefaultImageReader,
    createDefaultImageWriter,
    locale_en_gb,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_defaults,
    plugin_crop_locale_en_gb,
    plugin_filter,
    plugin_filter_defaults,
    plugin_filter_locale_en_gb,
    plugin_finetune,
    plugin_finetune_defaults,
    plugin_finetune_locale_en_gb,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,

    // filepond
    openEditor,
    processImage,
    createDefaultImageOrienter,
    legacyDataToImageState,
} from "doka";

import FilePondPluginFileEncode from "filepond-plugin-file-encode";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

// Create FilePond component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImageEditor,
    FilePondPluginFilePoster,
    FilePondPluginFileEncode
);

export default {
    components: {
        DokaImageEditorModal,
        FilePond,
        ChevronRightIcon,
    },
    props: ['initialFiles'],
    data() {
        return {
            // defaults
            editorProps: {
                imageReader: createDefaultImageReader(),
                imageWriter: createDefaultImageWriter(),
                ...plugin_crop_defaults,
                ...plugin_finetune_defaults,
                ...plugin_filter_defaults,
                ...markup_editor_defaults,
                locale: {
                    ...locale_en_gb,
                    ...plugin_crop_locale_en_gb,
                    ...plugin_finetune_locale_en_gb,
                    ...plugin_filter_locale_en_gb,
                    ...plugin_annotate_locale_en_gb,
                    ...markup_editor_locale_en_gb,
                },
            },

            // inline state
            inlineSrc: this.$appImgsPath + "sample1.jpeg",
            inlineResult: undefined,

            // modal state
            modalSrc: this.$appImgsPath + "sample2.jpeg",
            modalVisible: false,
            modalResult: undefined,

            // overlay state
            overlaySrc: this.$appImgsPath + "sample3.jpeg",
            overlayVisible: false,
            overlayResult: {
                imageState: undefined,
                imagePreview: undefined,
            },

            // filepond
            myEditor: {
                // map legacy data objects to new imageState objects
                legacyDataToImageState: legacyDataToImageState,

                // used to create the editor, receives editor configuration, should return an editor instance
                createEditor: openEditor,

                // Required, used for reading the image data
                imageReader: [createDefaultImageReader],

                // optionally. can leave out when not generating a preview thumbnail and/or output image
                imageWriter: [createDefaultImageWriter],

                // used to generate poster images, runs an editor in the background
                imageProcessor: processImage,

                // editor options
                editorOptions: {
                    imageOrienter: createDefaultImageOrienter(),
                    ...plugin_crop_defaults,
                    ...plugin_finetune_defaults,
                    ...plugin_filter_defaults,
                    ...markup_editor_defaults,
                    locale: {
                        ...locale_en_gb,
                        ...plugin_crop_locale_en_gb,
                        ...plugin_finetune_locale_en_gb,
                        ...plugin_filter_locale_en_gb,
                        ...markup_editor_locale_en_gb,
                    },
                },
            },
            filesToLoad: [],
            uploadedFiles: [],
            filesMeta: [],
        };
    },
    methods: {
        // inline
        handleInlineLoad: function (res) {
            console.log("inline load", res);
        },
        handleInlineProcess: function (res) {
            console.log("inline process", res);
            this.inlineResult = URL.createObjectURL(res.dest);
        },

        // modal
        handleModalLoad: function (res) {
            console.log("modal load", res);
        },
        handleModalShow: function () {
            console.log("modal show");
        },
        handleModalClose: function () {
            console.log("modal close");
        },
        handleModalProcess: function (res) {
            console.log("modal process", res);
            this.modalResult = URL.createObjectURL(res.dest);
        },

        // overlay
        handleOverlayLoad: function (res) {
            console.log("overlay load", res);
        },
        handleOverlayProcess: function (res) {
            console.log("overlay process", res);
            const { imageState, dest } = res;
            this.overlayResult = {
                imagePreview: URL.createObjectURL(dest),
                imageState: imageState,
            };
            this.overlayVisible = false;
        },

        // filepond
        handleFilePondInit: function () {
            // FilePond instance methods are available on `this.$refs.pond`
            // example of instance method call on pond reference
            // this.$refs.pond.getFiles();
            // Add 'All files" indicator
            var h3 = document.createElement("h3");
            var titleText = document.createTextNode("All Uploads");
            h3.className = "uploads-title";
            h3.style.display = "none";
            h3.appendChild(titleText);
            document.querySelector(".filepond--list-scroller").prepend(h3);
        },
        handleFilePondAddFile: function () {
            this.filesMeta = this.$refs.pond.getFiles();
            this.isUploadsEmpty();
        },

        handleFilePondRemoveFile: function () {
            const allFiles = this.$refs.pond.getFiles();
            this.uploadedFiles = [];
            allFiles.forEach((element) => {
                this.uploadedFiles.push({
                    id: element.id,
                    value: element.getFileEncodeDataURL(),
                });
            });
            this.filesMeta = this.$refs.pond.getFiles();
            this.isUploadsEmpty();
        },

        setUploads() {
            const allFiles = this.$refs.pond.getFiles();
            this.uploadedFiles = [];
            allFiles.forEach((element) => {
                this.uploadedFiles.push( element.getFileEncodeDataURL() );
            });
        },

        isUploadsEmpty() {
            if (this.filesMeta.length === 0) {
                document.querySelector(".uploads-title").style.display = "none";
                document.querySelector(".go-to-review").style.display = "none";
                this.removeHasFilesIndicator();
            } else {
                document.querySelector(".uploads-title").style.display = "block";
                document.querySelector(".go-to-review").style.display = "block";
                this.addHasFilesIndicator();
                this.hasFiles = true;
            }
        },

        addHasFilesIndicator() {
            document
                .querySelector("#uploadFieldWrap")
                .classList.add("has-files");
            document.querySelector(".uploader").classList.add("has-files");
        },

        removeHasFilesIndicator() {
            document
                .querySelector("#uploadFieldWrap")
                .classList.add("has-files");
            document.querySelector(".uploader").classList.add("has-files");
        },

        //eventBus
        reviewPhotos() {
            this.setUploads();
            eventBus.$emit("update-uploaded-files", this.uploadedFiles);
            eventBus.$emit("change-step", "review");
        },
    },

    mounted() {
        if(this.initialFiles) {
            this.filesToLoad = this.initialFiles;
        }
    },

    updated() {
        // console.log(`At this point, Virtual DOM has re-rendered and patched.`);
        // Fired every second, should always be true
        // console.log(+this.$refs['example-element'].textContent === this.counter)
    },
};
</script>

<style lang="scss">
@import "../../node_modules/doka/doka.css";

.doka-image-editor {
    box-shadow: 0 0 0 1px #eee;
}

.filepond--wrapper {
    padding: 0 0 0;
    background-color: white;
    border-radius: 5px;
    min-height: 172px;
    overflow: hidden;
    .filepond--browser {
        min-height: 172px;
    }
}

.go-to-review {
    position: relative;
    top: -90px;
    left: 35px;
    display: none;
}

#uploadFieldWrap {
    &.has-files {
        .filepond--wrapper {
            padding: 100px 0 100px;
            max-height: none;
            @media (max-width: 765px) {
                margin-top: 50px;
            }
        }
        .filepond--root {
            border: none;
            margin: 0;
        }
        .go-to-review {
            display: block;
        }
        .filepond--drop-label {
            top: -70px;
            border: 2px dashed #f10026;
            border-radius: 5px;
            margin: 10px 0;
            padding: 10px 30px;
            width: calc(100% - 70px);
            label {
                margin: 0 auto;
                display: inline-block;
            }
            @media (max-width: 765px) {
                margin: 0;
                padding: 0;
                height: auto;
                label {
                    padding-bottom: 20px;
                }
            }
        }
        .filepond--list-scroller {
            left: 15px;
        }
        .filepond--browser {
            // width: calc(100% - 0px);
        }
        .filepond--panel {
            opacity: 0;
        }
    }
    @media (max-width: 765px) {
        margin: 0 -15px;
    }
}
</style>
