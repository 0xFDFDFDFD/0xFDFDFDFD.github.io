(function () {
    "use strict";

    /* ============================================================
       Device-type lookup table (value → symbolic name)
       ============================================================ */
    var deviceTypeMap = {
        0x00000001: "FILE_DEVICE_BEEP", 0x00000002: "FILE_DEVICE_CD_ROM", 0x00000003: "FILE_DEVICE_CD_ROM_FILE_SYSTEM",
        0x00000004: "FILE_DEVICE_CONTROLLER", 0x00000005: "FILE_DEVICE_DATALINK", 0x00000006: "FILE_DEVICE_DFS",
        0x00000007: "FILE_DEVICE_DISK", 0x00000008: "FILE_DEVICE_DISK_FILE_SYSTEM", 0x00000009: "FILE_DEVICE_FILE_SYSTEM",
        0x0000000a: "FILE_DEVICE_INPORT_PORT", 0x0000000b: "FILE_DEVICE_KEYBOARD", 0x0000000c: "FILE_DEVICE_MAILSLOT",
        0x0000000d: "FILE_DEVICE_MIDI_IN", 0x0000000e: "FILE_DEVICE_MIDI_OUT", 0x0000000f: "FILE_DEVICE_MOUSE",
        0x00000010: "FILE_DEVICE_MULTI_UNC_PROVIDER", 0x00000011: "FILE_DEVICE_NAMED_PIPE", 0x00000012: "FILE_DEVICE_NETWORK",
        0x00000013: "FILE_DEVICE_NETWORK_BROWSER", 0x00000014: "FILE_DEVICE_NETWORK_FILE_SYSTEM", 0x00000015: "FILE_DEVICE_NULL",
        0x00000016: "FILE_DEVICE_PARALLEL_PORT", 0x00000017: "FILE_DEVICE_PHYSICAL_NETCARD", 0x00000018: "FILE_DEVICE_PRINTER",
        0x00000019: "FILE_DEVICE_SCANNER", 0x0000001a: "FILE_DEVICE_SERIAL_MOUSE_PORT", 0x0000001b: "FILE_DEVICE_SERIAL_PORT",
        0x0000001c: "FILE_DEVICE_SCREEN", 0x0000001d: "FILE_DEVICE_SOUND", 0x0000001e: "FILE_DEVICE_STREAMS",
        0x0000001f: "FILE_DEVICE_TAPE", 0x00000020: "FILE_DEVICE_TAPE_FILE_SYSTEM", 0x00000021: "FILE_DEVICE_TRANSPORT",
        0x00000022: "FILE_DEVICE_UNKNOWN", 0x00000023: "FILE_DEVICE_VIDEO", 0x00000024: "FILE_DEVICE_VIRTUAL_DISK",
        0x00000025: "FILE_DEVICE_WAVE_IN", 0x00000026: "FILE_DEVICE_WAVE_OUT", 0x00000027: "FILE_DEVICE_8042_PORT",
        0x00000028: "FILE_DEVICE_NETWORK_REDIRECTOR", 0x00000029: "FILE_DEVICE_BATTERY", 0x0000002a: "FILE_DEVICE_BUS_EXTENDER",
        0x0000002b: "FILE_DEVICE_MODEM", 0x0000002c: "FILE_DEVICE_VDM", 0x0000002d: "FILE_DEVICE_MASS_STORAGE",
        0x0000002e: "FILE_DEVICE_SMB", 0x0000002f: "FILE_DEVICE_KS", 0x00000030: "FILE_DEVICE_CHANGER",
        0x00000031: "FILE_DEVICE_SMARTCARD", 0x00000032: "FILE_DEVICE_ACPI", 0x00000033: "FILE_DEVICE_DVD",
        0x00000034: "FILE_DEVICE_FULLSCREEN_VIDEO", 0x00000035: "FILE_DEVICE_DFS_FILE_SYSTEM", 0x00000036: "FILE_DEVICE_DFS_VOLUME",
        0x00000037: "FILE_DEVICE_SERENUM", 0x00000038: "FILE_DEVICE_TERMSRV", 0x00000039: "FILE_DEVICE_KSEC",
        0x0000003A: "FILE_DEVICE_FIPS", 0x0000003B: "FILE_DEVICE_INFINIBAND", 0x0000003E: "FILE_DEVICE_VMBUS",
        0x0000003F: "FILE_DEVICE_CRYPT_PROVIDER", 0x00000040: "FILE_DEVICE_WPD", 0x00000041: "FILE_DEVICE_BLUETOOTH",
        0x00000042: "FILE_DEVICE_MT_COMPOSITE", 0x00000043: "FILE_DEVICE_MT_TRANSPORT", 0x00000044: "FILE_DEVICE_BIOMETRIC",
        0x00000045: "FILE_DEVICE_PMI", 0x00000046: "FILE_DEVICE_EHSTOR", 0x00000047: "FILE_DEVICE_DEVAPI",
        0x00000048: "FILE_DEVICE_GPIO", 0x00000049: "FILE_DEVICE_USBEX", 0x00000050: "FILE_DEVICE_CONSOLE",
        0x00000051: "FILE_DEVICE_NFP", 0x00000052: "FILE_DEVICE_SYSENV", 0x00000053: "FILE_DEVICE_VIRTUAL_BLOCK",
        0x00000054: "FILE_DEVICE_POINT_OF_SERVICE", 0x00000055: "FILE_DEVICE_STORAGE_REPLICATION", 0x00000056: "FILE_DEVICE_TRUST_ENV",
        0x00000057: "FILE_DEVICE_UCM", 0x00000058: "FILE_DEVICE_UCMTCPCI", 0x00000059: "FILE_DEVICE_PERSISTENT_MEMORY",
        0x0000005a: "FILE_DEVICE_NVDIMM", 0x0000005b: "FILE_DEVICE_HOLOGRAPHIC", 0x0000005c: "FILE_DEVICE_SDFXHCI",
        0x0000005d: "FILE_DEVICE_UCMUCSI", 0x0000005e: "FILE_DEVICE_PRM", 0x0000005f: "FILE_DEVICE_EVENT_COLLECTOR",
        0x00000060: "FILE_DEVICE_USB4", 0x00000061: "FILE_DEVICE_SOUNDWIRE", 0x00000062: "FILE_DEVICE_FABRIC_NVME",
        0x00000063: "FILE_DEVICE_SVM", 0x00000064: "FILE_DEVICE_HARDWARE_ACCELERATOR", 0x00000065: "FILE_DEVICE_I3C"
    };

    /* ============================================================
       Transfer-method descriptions
       ============================================================ */
    var methodDescriptions = {
        0: {
            name: "METHOD_BUFFERED (0)",
            desc: "<strong>In & out copied to kernel space</strong> The I/O Manager allocates a non-paged pool buffer (<code>Irp->AssociatedIrp.SystemBuffer</code>).<br>1. Input: The I/O Manager copies the user's input buffer into a kernel-allocated SystemBuffer.<br>2. Output: Once the IOCTL completes, the I/O Manager copies the contents of the SystemBuffer into the user's output buffer."
        },
        1: {
            name: "METHOD_IN_DIRECT (1)",
            desc: "<strong>Direct I/O</strong><br>1. Input: Buffered (Copied to kernelspace. <code>Irp->AssociatedIrp.SystemBuffer</code>).<br>2. Output: Locked pages (<code>Irp->MdlAddress</code>, so in userspace). I/O Manager probes UserOutputBuffer for <strong>READ</strong> access and locks pages."
        },
        2: {
            name: "METHOD_OUT_DIRECT (2)",
            desc: "<strong>Direct I/O</strong><br>1. Input: Buffered (Copied to kernelspace. <code>Irp->AssociatedIrp.SystemBuffer</code>).<br>2. Output: Locked pages (<code>Irp->MdlAddress</code>, so in userspace). I/O Manager probes UserOutputBuffer for <strong>WRITE</strong> access and locks pages."
        },
        3: {
            name: "METHOD_NEITHER (3)",
            desc: "<strong>Raw / User Context.</strong> No OS copy or locking.<br>1. Input: <code>stack->Parameters.DeviceIoControl.Type3InputBuffer</code> (Virtual Addr).<br>2. Output: <code>Irp->UserBuffer</code> (Virtual Addr).<br><strong>Warning:</strong> Only accessible in the context of the calling thread. The driver must validate pointers and probe memory manually. Good luck :)"
        }
    };

    /* ============================================================
       Access-check descriptions
       ============================================================ */
    var accessDescriptions = {
        0: { name: "FILE_ANY_ACCESS (0)",              desc: "Any handle will be able to send an IOCTL." },
        1: { name: "FILE_READ_DATA (1)",               desc: "You need a handle with FILE_READ_DATA to send an IOCTL." },
        2: { name: "FILE_WRITE_DATA (2)",              desc: "You need a handle with FILE_WRITE_DATA to send an IOCTL." },
        3: { name: "FILE_READ_DATA | FILE_WRITE_DATA (3)", desc: "You need a handle with both FILE_READ_DATA and FILE_WRITE_DATA to send an IOCTL." }
    };

    /* ============================================================
       DOM references (cached once on init)
       ============================================================ */
    var elInput, elResults, elError;
    var elOutDeviceName, elOutDeviceVal, elOutAccess, elOutAccessDetails;
    var elOutFunction, elOutMethod, elOutMethodDetails, elOutBinary;

    /* ============================================================
       Decode & render
       ============================================================ */
    function decodeIoctl() {
        var inputStr = elInput.value.trim();
        var ioctl = parseInt(inputStr, 10);

        if (isNaN(ioctl)) {
            elError.style.display = "block";
            elResults.style.display = "none";
            return;
        }

        elError.style.display = "none";
        elResults.style.display = "block";

        /* 1. Method (bits 0–1) */
        var methodCode = ioctl & 0x03;
        var methodInfo = methodDescriptions[methodCode];

        /* 2. Function (bits 2–13) */
        var functionCode = (ioctl >>> 2) & 0xFFF;

        /* 3. Access (bits 14–15) */
        var accessCode = (ioctl >>> 14) & 0x03;
        var accessInfo = accessDescriptions[accessCode];

        /* 4. Device Type (bits 16–31) */
        var deviceType = (ioctl >>> 16) & 0xFFFF;
        var deviceName = deviceTypeMap[deviceType] || "UNKNOWN / CUSTOM";

        /* --- Update DOM --- */
        elOutDeviceName.textContent = deviceName;
        elOutDeviceVal.textContent = "0x" + deviceType.toString(16).toUpperCase() + " (" + deviceType + ")";

        elOutAccess.textContent = accessInfo.name;
        elOutAccessDetails.textContent = accessInfo.desc;

        elOutFunction.textContent = "0x" + functionCode.toString(16).toUpperCase() + " (" + functionCode + ")";

        elOutMethod.textContent = methodInfo.name;
        elOutMethodDetails.innerHTML = methodInfo.desc;

        elOutBinary.textContent =
            (ioctl >>> 0).toString(2).padStart(32, "0").match(/.{1,8}/g).join(" ");
    }

    /* ============================================================
       Init — cache DOM refs & attach event listeners
       ============================================================ */
    function init() {
        elInput           = document.getElementById("ioctlInput");
        elResults         = document.getElementById("results");
        elError           = document.getElementById("errorMsg");

        elOutDeviceName   = document.getElementById("outDeviceName");
        elOutDeviceVal    = document.getElementById("outDeviceVal");
        elOutAccess       = document.getElementById("outAccess");
        elOutAccessDetails = document.getElementById("outAccessDetails");
        elOutFunction     = document.getElementById("outFunction");
        elOutMethod       = document.getElementById("outMethod");
        elOutMethodDetails = document.getElementById("outMethodDetails");
        elOutBinary       = document.getElementById("outBinary");

        /* Button click */
        document.getElementById("ioctlDecodeBtn").addEventListener("click", decodeIoctl);

        /* Enter key in input */
        elInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") { decodeIoctl(); }
        });
    }

    /* Boot when DOM is ready */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
