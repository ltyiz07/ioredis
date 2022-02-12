import { expect } from "chai";
import { getFirstValueInFlattenedArray } from "../../lib/autoPipelining";
import { flatten } from "../../lib/utils/lodash";

describe("autoPipelining", function () {
  const expectGetFirstValueIs = (values, expected) => {
    expect(getFirstValueInFlattenedArray(values)).to.eql(expected);
    // getFirstValueInFlattenedArray should behave the same way as flatten(args)[0]
    // but be much more efficient.
    expect(flatten(values)[0]).to.eql(expected);
  };

  it("should be able to efficiently get array args", function () {
    expectGetFirstValueIs([], undefined);
    expectGetFirstValueIs([null, "key"], null);
    expectGetFirstValueIs(["key", "value"], "key");
    expectGetFirstValueIs([[], "key"], "key");
    expectGetFirstValueIs([["key"]], "key");
    // @ts-expect-error
    expectGetFirstValueIs([[["key"]]], ["key"]);
    // @ts-expect-error
    expectGetFirstValueIs([0, 1, 2, 3, 4], 0);
    // @ts-expect-error
    expectGetFirstValueIs([[true]], true);
    // @ts-expect-error
    expectGetFirstValueIs([Buffer.from("test")], Buffer.from("test"));
    // @ts-expect-error
    expectGetFirstValueIs([{}], {});
    // lodash.isArguments is true for this legacy js way to get argument lists
    const createArguments = function () {
      return arguments;
    };
    // @ts-expect-error
    expectGetFirstValueIs([createArguments(), createArguments("key")], "key");
    // @ts-expect-error
    expectGetFirstValueIs([createArguments("")], "");
  });
});