/*
    pat_parser.js
    - mpeg ts PAT table parser
*/

var dom_tid = document.getElementById("table_id");
var dom_ss_indicator = document.getElementById("section_syntax_indicator");
    var dom_mustbe_0 = document.getElementById("mustbe_0");
    var dom_reserved_1 = document.getElementById("reserved_1");
var dom_section_len = document.getElementById("section_len");
var dom_ts_id_h = document.getElementById("ts_id_high");
var dom_ts_id_l = document.getElementById("ts_id_low");
    var dom_reserved_2 = document.getElementById("reserved_2");
var dom_ver_num = document.getElementById("version_num");
var dom_cur_next_indi = document.getElementById("cur_next_indi");
var dom_section_num = document.getElementById("section_num");
var dom_last_section_num = document.getElementById("last_section_num");
var dom_prgm_num = document.getElementById("program_num");
    var dom_reserved_3 = document.getElementById("reserved_3");
var dom_pmt_pid = document.getElementById("pmt_pid");
var dom_crc32 = document.getElementById("crc_32");


var val_tid ="";
var val_ss_indicator ="";
    var val_mustbe_0 ="";
    var val_reserved_1 ="";
var val_section_len ="";
var val_ts_id ="";
    var val_reserved_2 ="";
var val_ver_num ="";
var val_cur_next_indi ="";
var val_section_num ="";
var val_last_section_num ="";
var val_prgm_num ="";
    var val_reserved_3 ="";
var val_pmt_pid ="";
var val_crc32 ="";


var pat_parse = (blob) => {
    val_tid = blob[0];
    val_ss_indicator = (blob[1]>>7)&0x01;
    val_mustbe_0 = (blob[1]>>6)&0x01;       
        dom_mustbe_0.style.backgroundColor=(val_mustbe_0)?"RED":"";
    val_reserved_1 = (blob[1]>>4)&0x03;
        dom_reserved_1.style.backgroundColor=(val_reserved_1!=3)?"RED":"";
    val_section_len = (((blob[1]&0x0F)<<8)|blob[2]);
    val_ts_id = ((blob[3]<<8)|blob[4]);
    val_reserved_2 = (blob[5]>>6)&0x03;
        dom_reserved_2.style.backgroundColor=(val_reserved_2!=3)?"RED":"";
    val_ver_num = (blob[5]>>1)&0x1F;
    val_cur_next_indi = blob[5]&0x01;
    val_section_num = blob[6];
    val_last_section_num = blob[7];
    dom_last_section_num.style.backgroundColor = (val_section_num > val_last_section_num) ? "RED" : "";
// console.log("tid:"+val_tid+",indi:"+val_ss_indicator+",section_len:"+val_section_len
//         +", tsid:"+val_ts_id+",ver_num:"+val_ver_num+", cn_indi:"+val_cur_next_indi
//         +", section_num:"+val_section_num+",last_sec_num:" +val_last_section_num );
    let offset = 8;
    let temp_prgm_num, temp_pid;
    val_pmt_pid = "";
    val_prgm_num = "";
    do {
        temp_prgm_num = ((blob[offset]<<8)|blob[offset+1]);
        // val_reserved_3 = (blob[offset+2]>>5)&0x07;
        temp_pid = (((blob[offset+2]&0x1F)<<8)|blob[offset+3]);
        val_pmt_pid += "<li>Program Number: <b>"+temp_prgm_num+"</b> (0x"+temp_prgm_num.toString(16).toUpperCase()
                        +"), program Map PID: <b>"+temp_pid+"</b>, (0x"+temp_pid.toString(16).toUpperCase()+")</li>" ;
        offset += 4;
    } while ( offset < (val_section_len-4) );       // -4 means CRC-32

    val_crc32 = ((blob[offset]<<24)|(blob[offset+1]<<16)|(blob[offset+2]<<8)|blob[offset+3]);
}


var set_result = () => {
    dom_tid.innerHTML="<sub>table_id:</sub>"+val_tid+" (0x"+val_tid.toString(16).toUpperCase()+")";
    dom_ss_indicator.innerHTML = "<sub>s_s_indi:</sub>"+val_ss_indicator;
        // dom_mustbe_0 = ;
        // dom_reserved_1 = ;
    dom_section_len.innerHTML = "<sub>section_length:</sub>"+val_section_len+" (0x"+val_section_len.toString(16).toUpperCase()+")";
    dom_ts_id_h.innerHTML = "<sub>transport_stream_id (16bit)</sub>";
    dom_ts_id_l.innerHTML = "<sub>ts_id:</sub>"+val_ts_id+" (0x"+val_ts_id.toString(16).toUpperCase()+")";
        // dom_reserved_2;
    dom_ver_num.innerHTML = "<sub>ver_num:</sub>"+val_ver_num+" (0x"+val_ver_num.toString(16).toUpperCase()+")";
    dom_cur_next_indi.innerHTML = "<sub>c_n_indi:</sub>"+val_cur_next_indi;
    dom_section_num.innerHTML = "<sub>section_num:</sub>"+val_section_num+" (0x"+val_section_num.toString(16).toUpperCase()+")";
    dom_last_section_num.innerHTML = "<sub>last_sec_num:</sub>"+val_last_section_num+" (0x"+val_last_section_num.toString(16).toUpperCase()+")";
    dom_crc32.innerHTML = "<sub>CRC:</sub>"+val_crc32+" (0x"+val_crc32.toString(16).toUpperCase() + ")"

    document.getElementById("pid_list").innerHTML = val_pmt_pid;
}

pid_list
var pat_file_changed = () => {    /* 파일로 부터 읽어 들일 때. */
    let loadingfiles = document.getElementById("packet_file_in");
    console.log(" 파일"+ loadingfiles.files[0].name +" .. Loading ..");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let buffer = new Uint8Array(reader.result);
        let pat_packet = get_ts_packet(buffer);
        // console.log("check : \n" + dump_blob(pat_packet,0) );
        document.getElementById("packet_dump").value = dump_blob(pat_packet,0);
        pat_parse(pat_packet);
        set_result();
    });
    reader.readAsArrayBuffer(loadingfiles.files[0]);     //    - File이나 Blob의 바이너리 데이터를 읽어서 ArrayBuffer로 반환
}

var pat_from_text = () => {
    let long_text = document.getElementById("packet_dump").value;
    console.log("test용 문자열: " + long_text );
    let blob = convert_text_to_blob(long_text);

    // console.log("변환한 값: " );
    // for (let i=0; i<blob.length; i++) {
    //     console.log(blob[i]);
    // }
    pat_parse(blob);
    set_result();
}

var read_offset_188bytes = () => {
    let offset_value = document.getElementById("read_offset").value;
    read_offset = offset_value;
    pat_file_changed();
}

var next_188bytes= () => {
    read_offset += 188;
    document.getElementById("read_offset").value = read_offset;
    pat_file_changed();
}

var make_dsmcc_addr_link = () => {
    let link_tag = document.getElementById("goto_link");
    link_tag.innerHTML = "<a href='http://ccash.gonetis.com:88/TS_analyzer/DSMCC-addressable/index.html?payload="+dump_blob(val_payload, 0)+"'>DSMCC-addressable</a>";
}


window.onload = function main() {
    let payload_str = getParameterByName("payload");
    let text_area = document.getElementById("packet_dump");
    console.log("packet data:" + payload_str);
    text_area.innerText = payload_str;
    pat_from_text();
}



/* **************************
* some utility funtions.. 
*/
var convert_text_to_blob = (inputtext) => {
    var str_array;
    if ( inputtext.indexOf(",") >= 0) {
        console.log("HAS comma");
        str_array = inputtext.split(',');
    } else {
        console.log("No Comma. Split with SPACE");
        str_array = inputtext.split(' ');
    }

    var ia = []; // new Uint8Array();
    for (let i=0; i<str_array.length; i++) {
        ia.push( (parseInt(str_array[i], 16) & 0xFF) );         /// TODO:  여기에서 str_array[i] 의 값을 HEX 문자열에서 UINT8로 바꾸어 주어야 함.
    }
    return ia;
}

//////////////////////////// 이런 종류의 parsing 할 때 기본적으로 사용되는 몇가지 함수들.
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var dump_blob = (data, start_idx) => {
    var dump_str = ""; 
    for (let i= start_idx; i< data.length; i++) {
        dump_str += data[i].toString(16).toUpperCase()+" ";
    }
    return dump_str;
}

