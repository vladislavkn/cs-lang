import { onMounted, ref } from "vue";

const useCodeWithSharing = () => {
  const code = ref("");

  onMounted(() => {
    code.value = decodeURI(window.location.hash.slice(1) || "");
  });

  const shareCode = () => {
    const encodedCode = encodeURI(code.value);
    window.location.hash = `#${encodedCode}`;

    const url = `${window.location.origin}#${encodedCode}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard! Share with friends :-) ");
  };

  return { code, shareCode };
};

export default useCodeWithSharing;
