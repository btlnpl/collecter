import json
import os

decoder = json.JSONDecoder()


with open('/home/bikash/Downloads/clickstream-10-2020-11-26-11-57-24-c6a9f6e2-d7c5-46bf-81dc-1435ca86fd15', 'r') as content_file:

    content = content_file.read()

    content_length = len(content)
    decode_index = 0

    while decode_index < content_length:
        try:
            obj, decode_index = decoder.raw_decode(content, decode_index)
            print("File index:", decode_index)
            print(obj)
        except JSONDecodeError as e:
            print("JSONDecodeError:", e)
            # Scan forward and keep trying to decode
            decode_index += 1
